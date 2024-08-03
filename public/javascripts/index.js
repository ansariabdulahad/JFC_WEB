// REDIRECTING USER TO PROFILE PAGE IF USER ALREADY LOGGED IN
if (document.cookie.indexOf("authToken") != -1) {
    window.location = "/students";
}

// LOGIN MODAL REQUEST CODING
$(document).ready(function () {
    $("#login-modal-request").click((e) => {
        e.preventDefault();
        $("#signup-modal").modal("hide");
        $("#login-modal").modal("show");
    })
});

// SIGNUP MODAL REQUEST CODING
$(document).ready(function () {
    $("#signup-modal-request").click((e) => {
        e.preventDefault();
        $("#login-modal").modal("hide");
        $("#signup-modal").modal("show");
    })
});

// SIGNUP REQUEST CODING
$(document).ready(function () {
    $("#signup-form").submit((e) => {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "api/signup",
            data: new FormData(e.target),
            contentType: false,
            processData: false,
            beforeSend: () => {
                $(".before-send").removeClass("d-none");
                $(".signup-btn").addClass("d-none");
            },
            success: function (response) {

                $(".before-send").addClass("d-none");
                $(".signup-btn").removeClass("d-none");

                if (response.isUserCreated) {
                    window.location = "/students";
                }
            },
            error: (error) => {
                $(".before-send").addClass("d-none");
                $(".signup-btn").removeClass("d-none");

                const errorRes = error.responseJSON;

                if (error.status == 409) {
                    const label = errorRes.message.label;
                    const field = "." + errorRes.message.field;

                    $(field).addClass("border border-danger");
                    $(field + "-error").html(label);

                    setTimeout(() => {
                        resetValidator(field); // calling...
                    }, 3000);
                }
                else {
                    swal("500", "Internal Server Error !", "warning");
                }
            }
        });
    });
});

// ENABLE LOGIN BTN CODING
$(document).ready(function () {
    $(".loginAs").each(function () {
        $(this).on("change", function () {
            $(".login-btn").prop("disabled", false);
        })
    })
});

// LOGIN REQUEST CODING
$(document).ready(function () {
    $("#login-form").submit((e) => {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "api/login",
            data: new FormData(e.target),
            contentType: false,
            processData: false,
            beforeSend: () => {
                $(".before-send").removeClass("d-none");
                $(".login-btn").addClass("d-none");
            },
            success: function (response) {
                $(".before-send").addClass("d-none");
                $(".login-btn").removeClass("d-none");

                if (response.role == 'admin') {
                    window.location = "/students";
                }
                else if (response.role == 'student') {
                    window.location = '/premium';
                }
                else {
                    // Employee
                }
                console.log("SUCCESS RES :: ", response);
            },
            error: (error) => {
                $(".before-send").addClass("d-none");
                $(".login-btn").removeClass("d-none");

                if (error.status == 404) {
                    $(".username").addClass("border border-danger");
                    $(".username-error").html("User not found");

                    setTimeout(() => {
                        resetValidator(".username");
                    }, 2000);
                }
                else if (error.status == 401) {
                    $(".password").addClass("border border-danger");
                    $(".password-error").html("Wrong Password");

                    setTimeout(() => {
                        resetValidator(".password");
                    }, 2000);
                }
                else if (error.status == 406) {
                    // $(".password").addClass("border border-danger");
                    // $(".password-error").html(error.responseJSON.message);

                    // setTimeout(() => {
                    //     resetValidator(".password");
                    // }, 2000);
                    swal("406", "Please logout from other device !", "error");
                }
                else {
                    swal("500 !", "Internal Server Error !", "warning");
                }
            }
        });
    });
});


// RESET VALIDATOR FUNCTION CODING
const resetValidator = (field) => {
    $(field).removeClass("border-danger");
    $(field + "-error").html('');
}