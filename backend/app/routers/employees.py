"""Employee CRUD with Admin (all) vs Manager (assigned) visibility."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.constants import ROLE_ADMIN, ROLE_MANAGER, ROLE_SUPER_ADMIN, ROLE_USER
from app.database import get_db
from app.deps import get_current_user, require_roles
from app.models.user import User
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.services import employee_service

router = APIRouter(prefix="/employees", tags=["employees"])

_employee_writers = require_roles(ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_MANAGER)


@router.get("", response_model=list[EmployeeResponse])
def list_employees(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
) -> list[EmployeeResponse]:
    if current.role_rel.role_name == ROLE_USER:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Employees list not available for this role")
    rows = employee_service.list_employees_for_user(db, current)
    return [EmployeeResponse(id=e.id, name=e.name, manager_id=e.manager_id) for e in rows]


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee_route(
    body: EmployeeCreate,
    db: Session = Depends(get_db),
    actor: User = Depends(_employee_writers),
) -> EmployeeResponse:
    try:
        e = employee_service.create_employee(db, body, actor)
    except PermissionError as err:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(err)) from err
    return EmployeeResponse(id=e.id, name=e.name, manager_id=e.manager_id)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee_route(
    employee_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
) -> EmployeeResponse:
    e = employee_service.get_employee(db, employee_id)
    if e is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Employee not found")
    if not employee_service.can_access_employee(current, e):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot access this employee")
    return EmployeeResponse(id=e.id, name=e.name, manager_id=e.manager_id)


@router.patch("/{employee_id}", response_model=EmployeeResponse)
def update_employee_route(
    employee_id: int,
    body: EmployeeUpdate,
    db: Session = Depends(get_db),
    actor: User = Depends(_employee_writers),
) -> EmployeeResponse:
    e = employee_service.get_employee(db, employee_id)
    if e is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Employee not found")
    try:
        e2 = employee_service.update_employee(db, e, body, actor)
    except PermissionError as err:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(err)) from err
    return EmployeeResponse(id=e2.id, name=e2.name, manager_id=e2.manager_id)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee_route(
    employee_id: int,
    db: Session = Depends(get_db),
    actor: User = Depends(_employee_writers),
) -> None:
    e = employee_service.get_employee(db, employee_id)
    if e is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Employee not found")
    try:
        employee_service.delete_employee(db, e, actor)
    except PermissionError as err:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(err)) from err
