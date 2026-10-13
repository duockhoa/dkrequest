export function hasDevFullAccess(user) {
    return user?.permissions?.devFullAccess === true;
}
