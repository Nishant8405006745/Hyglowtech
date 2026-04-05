"""Employee persistence and visibility rules."""

from sqlalchemy.orm import Session

from app.constants import EMPLOYEE_ADMIN_ROLES, ROLE_MANAGER
from app.models.employee import Employee
from app.models.user import User
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


def get_employee(db: Session, employee_id: int) -> Employee | None:
    return db.query(Employee).filter(Employee.id == employee_id).first()


def list_employees_for_user(db: Session, user: User) -> list[Employee]:
    role = user.role_rel.role_name
    if role in EMPLOYEE_ADMIN_ROLES:
        return db.query(Employee).order_by(Employee.id).all()
    if role == ROLE_MANAGER:
        return (
            db.query(Employee)
            .filter(Employee.manager_id == user.id)
            .order_by(Employee.id)
            .all()
        )
    return []


def can_access_employee(user: User, emp: Employee) -> bool:
    role = user.role_rel.role_name
    if role in EMPLOYEE_ADMIN_ROLES:
        return True
    if role == ROLE_MANAGER and emp.manager_id == user.id:
        return True
    return False


def create_employee(db: Session, data: EmployeeCreate, actor: User) -> Employee:
    role = actor.role_rel.role_name
    if role in EMPLOYEE_ADMIN_ROLES:
        emp = Employee(name=data.name, manager_id=data.manager_id)
        db.add(emp)
        db.commit()
        db.refresh(emp)
        return emp
    if role == ROLE_MANAGER:
        emp = Employee(name=data.name, manager_id=actor.id)
        db.add(emp)
        db.commit()
        db.refresh(emp)
        return emp
    raise PermissionError("Cannot create employees")


def update_employee(db: Session, emp: Employee, data: EmployeeUpdate, actor: User) -> Employee:
    if not can_access_employee(actor, emp):
        raise PermissionError("Cannot update this employee")
    role = actor.role_rel.role_name
    if data.name is not None:
        emp.name = data.name
    if data.manager_id is not None:
        if role not in EMPLOYEE_ADMIN_ROLES:
            raise PermissionError("Only Admin can reassign manager")
        emp.manager_id = data.manager_id
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


def delete_employee(db: Session, emp: Employee, actor: User) -> None:
    if not can_access_employee(actor, emp):
        raise PermissionError("Cannot delete this employee")
    if actor.role_rel.role_name == ROLE_MANAGER and emp.manager_id != actor.id:
        raise PermissionError("Cannot delete this employee")
    db.delete(emp)
    db.commit()
