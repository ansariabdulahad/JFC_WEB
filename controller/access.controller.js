const tokenService = require("../services/token.service");

const accessList = {
    admin: {
        toolbar: [
            {
                icon: "fa fa-bell",
                link: "/notifications",
                design: "icon-btn-dark"
            },
            {
                icon: "fas fa-user-secret",
                link: "/students",
                design: "icon-btn-primary",
            },
            {
                icon: "fas fa-users",
                link: "/teams",
                design: "icon-btn-warning"
            },
            {
                icon: "fa fa-cog",
                link: "/settings",
                design: "icon-btn-info"
            },
            {
                icon: "fa fa-sign-out-alt",
                link: "/logout",
                design: "icon-btn-danger",
            },
        ],
    },
    employee: {
        toolbar: [
            {
                icon: "fa fa-sign-out-alt",
                link: "/logout",
                design: "icon-btn-danger",
            }
        ]
    },
    student: {
        toolbar: [
            {
                icon: "fa fa-bell",
                link: "/notifications",
                design: "icon-btn-dark"
            },
            {
                icon: "fa fa-cog",
                link: "/settings",
                design: "icon-btn-info"
            },
            {
                icon: "fa fa-sign-out-alt",
                link: "/logout",
                design: "icon-btn-danger",
            }
        ]
    },
};

const getAccess = async (req, res) => {
    const tokenData = await tokenService.verifyToken(req);
    const role = tokenData.data.role;

    res.status(200).json({
        data: accessList[role],
    });
};

module.exports = {
    getAccess,
};
