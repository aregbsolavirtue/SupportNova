from fastapi import Depends, HTTPException, status
from src.security.auth import get_current_user
from src.database.models import User


def require_role(*allowed_roles: str):
    """Use this on any endpoint that only certain roles should access.
    Example: require_role("reviewer", "manager", "admin")"""
    async def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.value not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role.value}' is not permitted to do this.",
            )
        return current_user
    return dependency