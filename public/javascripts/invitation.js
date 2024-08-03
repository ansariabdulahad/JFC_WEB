$(document).ready(function () {
    const inv = getInvitaion();
    $(".logo").attr("src", inv.companyLogo);
    $(".company-name").html(inv.companyName);
    $(".email").html(inv.companyEmail);
});

const getInvitaion = () => {
    const url = window.location.pathname;
    const array = url.split("/");
    const inv = decodeToken(array[array.length - 1]);
    const token = array[array.length - 1];
    inv.data['token'] = token;
    return inv.data;
}

let profileUrl = '<i class="fa fa-user-circle mx-3" style="font-size: 45px;"></i>';
let isProfile = false;

// UPLOAD PROFILE
$(document).ready(function () {
    $(".student-profile").on("change", async function () {
        let file = this.files[0];
        let objectUrl = await uploadFileOnS3(file);
        profileUrl = objectUrl;
        isProfile = true;
    })
});

// UPDATE USER INFO
$(document).ready(function () {
    $("form").submit(async function (e) {
        e.preventDefault();
        let inv = getInvitaion();
        const formData = new FormData(this);
        formData.append("studentProfile", profileUrl);
        formData.append("isProfile", isProfile);
        formData.append("token", inv.token);

        const request = {
            type: "POST",
            url: "/students/" + inv.studentId,
            data: formData
        }

        await ajax(request);
        window.location = '/';
    })
});