// LOAD ACCESS
$(document).ready(async function () {
    const request = {
        type: 'GET',
        url: '/access'
    }

    const response = await ajax(request);
    showToolbar(response.data.toolbar);
});

const showToolbar = (toolbar) => {
    for (let menu of toolbar) {
        let li = `
            <li class="nav-item">
                <button class="btn toolbar mx-2 ${menu.design}">
                    <a href="${menu.link}" class="${menu.design} nav-link">
                        <i class="${menu.icon}"></i>
                    </a>
                </button>
            </li>
        `;
        $("#toolbar").append(li);
    }
}

$(document).ready(function () {
    $(".toggler").click(() => {
        let state = $(".sidenav").hasClass("sidenav-open");

        if (state) {
            // SIDENAV CONTROL
            $(".sidenav").removeClass("sidenav-open");
            $(".sidenav").addClass("sidenav-close");

            // SECTION CONTROL
            $(".section").removeClass("section-open");
            $(".section").addClass("section-close");
        }
        else {
            // SIDENAV CONTROL
            $(".sidenav").addClass("sidenav-open");
            $(".sidenav").removeClass("sidenav-close");

            // SECTION CONTROL
            $(".section").addClass("section-open");
            $(".section").removeClass("section-close");
        }
    })
});

// SHOW COMPANY INFO
$(document).ready(function () {
    const token = getCookie("authToken");
    const companyObj = decodeToken(token);
    const companyInfo = companyObj.data.companyInfo;

    $(".company-name").html(companyInfo.company);
    $(".company-email").html(companyInfo.email);
    $(".company-mobile").html(companyInfo.mobile);

    if (companyInfo.isLogo) {
        $(".logo-box").html('');
        $(".logo-box").css({
            backgroundImage: `url(${companyInfo.logoUrl})`,
            backgroundSize: "cover"
        })
    }
});

// UPLOAD LOGO
$(document).ready(function () {

    $(".logo-box").click(function () {
        let imgType = ["image/png", "image/jpeg", "image/gif", "image/ico", "image/webp", "image/jpg"];
        let input = document.createElement("INPUT");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        // ONINPUT EVENT CODING
        input.onchange = async function () {
            let file = this.files[0];

            // SHOW PROGRESS LOADER
            $(".uploader").removeClass("d-none");
            $(".uploader").toast("show");

            if (imgType.indexOf(file.type) != -1) {
                const objectUrl = await uploadFileOnS3(file);

                $(".logo-box").html('Wait...');
                const isUpdated = await updateLogoUrl(objectUrl);

                if (isUpdated) {
                    $(".logo-box").html('');
                    $(".logo-box").css({
                        backgroundImage: `url(${objectUrl})`,
                        backgroundSize: "cover"
                    });
                }
            }
            else {
                swal("Only Image File Accepted", "Please upload image file !", "warning");
            }
        }
    })
});

// UPDATE LOGO URL FUNCTION CODING
const updateLogoUrl = async (url) => {
    const token = getCookie("authToken");
    const company = decodeToken(token);
    const id = company.data.uid;
    const formData = new FormData();

    formData.append("isLogo", true);
    formData.append("logoUrl", url);
    formData.append("token", token);

    const request = {
        type: "PUT",
        url: "/api/private/company/" + id,
        data: formData
    }

    try {
        await ajax(request);
        return true;
    } catch (error) {
        return false;
    }
}