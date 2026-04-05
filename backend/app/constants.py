"""Application constants — role display names stored in `roles.role_name`."""

ROLE_SUPER_ADMIN = "Super Admin"
ROLE_ADMIN = "Admin"
ROLE_MANAGER = "Manager"
ROLE_USER = "User"

ALL_ROLES = (ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_MANAGER, ROLE_USER)

# Who may manage users / assign any role
USER_ADMIN_ROLES = {ROLE_SUPER_ADMIN, ROLE_ADMIN}

# Who may CRUD all employees
EMPLOYEE_ADMIN_ROLES = {ROLE_SUPER_ADMIN, ROLE_ADMIN}

# Managers may only touch employees where manager_id == their user id
EMPLOYEE_MANAGER_ROLES = {ROLE_MANAGER}
