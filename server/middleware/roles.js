const { roles } = require('../config/roles');

exports.grantAccess = function (action, resource) {
    return async (request, response, next) => {
        try {
            const permission = roles.can(request.user.role).action(resource);
            if ( !permission.granted ) {
                return response.status(400)
                    .json({message: 'You don\'t have permission for this action.'});
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}
