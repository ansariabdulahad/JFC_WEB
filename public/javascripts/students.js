// GET COUNTRY CODE
$(document).ready(function () {
    $(".country").on('input', async function () {
        let keyword = $(this).val().trim().toLowerCase();
        let localData = checkInLs("countryCode");

        if (localData.isExists) {
            const countries = localData.data;

            for (let country of countries) {
                if (country.name.toLowerCase().indexOf(keyword) != -1) {
                    const dial_code = country.dial_code;
                    $(".code").html(dial_code);
                }
            }
        }
        else {
            const request = {
                type: "GET",
                url: "../json/country-code.json"
            }
            const response = await ajax(request);
            localStorage.setItem("countryCode", JSON.stringify(response));
        }
    })
});

// ADD STUDENTS INFO TO DB
$(document).ready(function () {
    $("#student-form").submit(async function (e) {
        e.preventDefault();
        const token = getCookie("authToken");
        let formData = new FormData(this);
        formData.append("token", token);
        const request = {
            type: "POST",
            url: "/students",
            data: formData,
            isLoader: true,
            commonBtn: ".add-student-btn",
            loaderBtn: ".student-loader-btn"
        }

        try {
            const dataRes = await ajax(request);
            const student = dataRes.data;
            const tr = dynamicTr(student); // calling...
            $(".students-list").append(tr);
            // ACTIVATING STUDENT ACTION FUNCTIONS
            studentAction(); // calling...
            $("#student-modal").modal("hide");
        } catch (error) {
            $(".student-email").addClass("animate__animated animate__shakeX border border-danger");

            $(".student-email").click(function () {
                $(this).removeClass("animate__animated animate__shakeX border border-danger");
                // $(this).val("");
            })
        }
    })
});

// UPDATE STUDENTS CODING
const updateStudent = (oldTr) => {
    $(".update-student-btn").click(async function (e) {
        e.preventDefault();
        let id = this.getAttribute("data-id");
        let form = document.querySelector("#student-form");
        const token = getCookie("authToken");
        let formData = new FormData(form);
        formData.append("token", token);
        formData.append("updatedAt", new Date());
        const request = {
            type: "PUT",
            url: "/students/" + id,
            data: formData,
            isLoader: true,
            commonBtn: ".update-student-btn",
            loaderBtn: ".student-loader-btn"
        }

        try {
            const response = await ajax(request);
            const student = response.data;
            const tr = dynamicTr(student);
            const updateTd = $(tr).html();
            $(oldTr).html(updateTd);
            oldTr = "";
            $(".add-student-btn").removeClass("d-none");
            $(".update-student-btn").addClass("d-none");
            $("#student-modal").modal("hide");
            $(form).trigger('reset');
            studentAction(); // calling...
        } catch (error) {
            console.log(error);
        }
    });
};

// SHOW STUDENTS
$(document).ready(function () {
    let from = 0;
    let to = 5;

    showStudents(from, to); // calling...
    getPaginationList(); // calling...
});

// SHOW STUDENTS FUNCTION CODING
const showStudents = async (from, to) => {
    $(".students-list").html('');
    const request = {
        type: "GET",
        url: `/students/${from}/${to}`,
        isLoader: true,
        commonBtn: ".tmp",
        loaderBtn: ".students-skeleton"
    };

    const response = await ajax(request);

    if (response.data.length > 0) {

        let currentStudent = JSON.stringify(response.data);
        sessionStorage.setItem("current-student", currentStudent);

        for (let student of response.data) {
            let tr = dynamicTr(student); // calling...

            $(".students-list").append(tr);
        }

        studentAction(); // calling...
    }
    else {
        swal("No Data Found !", "Add Students !", "warning");
    }
}

// DYNAMIC TR FUNCTION CODING
const dynamicTr = (student) => {
    const studentString = JSON.stringify(student);
    let studentData = studentString.replace(/"/g, "'");
    let tr = `

        <tr class="animate__animated animate__fadeIn animate__slower">
            <td class="text-nowrap">
                <div class="d-flex align-items-center">
                    ${student.isProfile ? `<img src="${student.studentProfile}" width="50px" height="50px" class="rounded-circle mx-3">` : `<i class="fa fa-user-circle mx-3" style="font-size: 45px;"></i>`}
                    <div>
                        <p class="p-0 m-0 text-capitalize">${student.studentName}</p>
                        <small class="text-uppercase">${student.studentCountry}</small>
                    </div>
                </div>
            </td>
            <td class="text-nowrap">${student.studentEmail}</td>
            <td class="text-nowrap">${student.studentFather}</td>
            <td class="text-nowrap">${student.studentDob}</td>
            <td class="text-nowrap">${student.studentMobile}</td>
            <td class="text-nowrap">${student.studentCountry}</td>
            <td class="text-nowrap">${student.studentState}</td>
            <td class="text-nowrap">${student.studentPincode}</td>
            <td class="text-nowrap">${student.studentAddress}</td>
            <td class="text-nowrap">
                ${student.status ? `<span class="badge badge-success">Active</span>` : `<span class="badge badge-danger">Pending</span>`}
            </td>
            <td class="text-nowrap">${formateDate(student.createdAt)}</td>
            <td class="text-nowrap">
                <div class="d-flex">
                    <button data-student="${studentData}" data-id="${student._id}" class="edit-student icon-btn-primary">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button data-id="${student._id}" class="delete-student icon-btn-danger mx-2">
                        <i class="fa fa-trash"></i>
                    </button>
                    <button data-id="${student._id}" data-email="${student.studentEmail}" class="share-student icon-btn-info">
                        <i class="fa fa-share"></i>
                    </button>
                </div>
            </td>
        </tr>

    `;

    return tr;
}

// STUDENT ACTION FUNCTION CODING
const studentAction = () => {
    // DELETE STUDENT ACTION
    $(document).ready(function () {
        $(".delete-student").each(function () {
            $(this).click(async function () {
                const tr = this.parentElement.parentElement.parentElement;
                const id = $(this).data("id");
                const token = getCookie("authToken");
                const request = {
                    type: "DELETE",
                    url: `/students/${id}`,
                    data: {
                        token: token
                    }
                }
                const isConfirm = await confirm("Deleted");

                if (isConfirm) {
                    await ajax(request);
                    tr.remove();
                }
            });
        });
    });

    // UPDATE STUDENT ACTION
    $(document).ready(function () {
        let allEditBtn = $(".edit-student");

        for (let btn of allEditBtn) {

            btn.onclick = function () {
                let tr = this.parentElement.parentElement.parentElement;
                const id = $(this).data("id");
                const studentString = $(this).data("student");
                const studentData = studentString.replace(/'/g, '"');
                const student = JSON.parse(studentData);

                for (let key in student) {
                    let value = student[key];
                    $(`[name=${key}]`).val(value);
                }

                $(".add-student-btn").addClass("d-none");
                $(".update-student-btn").removeClass("d-none");
                $(".update-student-btn").attr("data-id", id);
                $("#student-modal").modal("show");

                updateStudent(tr); // calling...
            }
        }
    });

    // OPEN SHARE MODAL
    $(document).ready(function () {
        $(".share-student").each(function () {
            $(this).click(async function () {
                let studentId = $(this).data("id");
                let studentEmail = $(this).data("email");
                const companyToken = getCookie("authToken");
                const tmp = decodeToken(companyToken);
                const company = tmp.data.companyInfo;
                const prepareDataForToken = JSON.stringify({
                    studentId: studentId,
                    companyName: company.company,
                    companyEmail: company.email,
                    companyLogo: company.logoUrl
                });
                const formData = new FormData();
                formData.append("token", getCookie("authToken"));
                formData.append("data", prepareDataForToken);
                const request = {
                    type: "POST",
                    url: "/get-token/172800",
                    data: formData
                }
                const response = await ajax(request);
                const token = response.token;
                let link = `${window.location}/invitation/${token}`;
                $("#share-email-btn").attr("data-email", studentEmail);
                $(".link").val(link);
                $("#share-modal").modal('show');
            })
        })
    });

    // COPY LINK
    $(document).ready(function () {
        $("#copy-btn").click(function () {
            $(".link").select();
            document.execCommand("copy");
            $("i", this).removeClass("fa fa-copy");
            $("i", this).addClass("fa fa-check");
            setTimeout(() => {
                $("i", this).removeClass("fa fa-check");
                $("i", this).addClass("fa fa-copy");
            }, 2000);
        })
    });

    // SHARE ON EMAIL
    $(document).ready(function () {
        $("#share-email-btn").click(async function () {
            const studentEmail = this.getAttribute("data-email");
            const token = getCookie("authToken");
            const tokenData = decodeToken(token);
            const company = tokenData.data.companyInfo;
            const formData = new FormData();
            const reciept = {
                to: studentEmail,
                subject: "Addmission Invitation Link !",
                message: "Thank you being the part of our team. We are happy to serve our services for you.",
                companyName: company.company,
                companyEmail: company.email,
                companyMobile: company.mobile,
                companyLogo: company.logoUrl,
                invitationLink: $(".link").val()
            }
            formData.append("token", token);
            formData.append("reciept", JSON.stringify(reciept));

            const request = {
                type: "POST",
                url: "/sendMail",
                data: formData,
                isLoader: true,
                commonBtn: ".tmp",
                loaderBtn: ".progress-loader"
            }

            try {
                const response = await ajax(request);
                $("#share-modal").modal("hide");
            } catch (error) {
                console.log(error);
            }
        })
    });
}

// GET PAGINATION LIST CODING
const getPaginationList = async () => {
    const request = {
        type: "GET",
        url: "/students/count-all"
    }
    const response = await ajax(request);
    const totalStudent = response.data;
    let length = totalStudent / 5;
    let skipData = 0;
    let i;

    if (length.toString().indexOf(".") != -1) {
        length = length + 1;
    }

    for (i = 1; i <= length; i++) {
        let button = `
            <button data-skip="${skipData}" class="${i == 1 ? 'active' : ''} btn-design border paginate-btn">
                <i> ${i} </i>
            </button >
    `;

        $("#student-pagination").append(button);
        skipData = skipData + 5;
    }

    getPaginationData(); // calling...
}

// GET PAGINATION DATA FUNCTION CODING
const getPaginationData = () => {
    $(".paginate-btn").each(function (index) {
        $(this).click(function (e) {
            e.preventDefault();
            controlPrevAndNext(index); // calling...
            let skip = $(this).data("skip");
            showStudents(skip, 5);
            removeClasses(".paginate-btn", "active"); // calling...
            $(this).addClass("active");
        })
    })
}

// NEXT BTN CODING
$(document).ready(function () {
    $("#next").click(function () {
        let currentIndex = 0;
        $(".paginate-btn").each(function () {
            if ($(this).hasClass("active")) {
                currentIndex = $(this).index();
            }
        });
        $(".paginate-btn").eq(currentIndex + 1).click();
        controlPrevAndNext(currentIndex + 1); // calling...
    });
});

// PREV BTN CODING
$(document).ready(function () {
    $("#prev").click(function () {
        let currentIndex = 0;
        $(".paginate-btn").each(function () {
            if ($(this).hasClass("active")) {
                currentIndex = $(this).index();
            }
        });
        $(".paginate-btn").eq(currentIndex - 1).click();
        controlPrevAndNext(currentIndex - 1); // calling...
    });
});

// CONTROL PREV AND NEXT BUTTON CODING
const controlPrevAndNext = (currentIndex) => {
    const totalBtn = $(".paginate-btn").length - 1;
    if (currentIndex == totalBtn) {
        $("#next").attr("disabled", true);
        $("#prev").attr("disabled", false);
    }
    else if (currentIndex > 0) {
        $("#prev").attr("disabled", false);
        $("#next").attr("disabled", false);
    }
    else {
        $("#next").attr("disabled", false);
        $("#prev").attr("disabled", true);
    }
}

// FILTER BY NAME, EMAIL AND MOBILE FUNCTION CODING
$(document).ready(function () {
    $(".filter").on("input", function () {
        let keyword = $(this).val().trim().toLowerCase();
        let tr = $(".students-list tr");

        $(tr).each(function () {
            let allTd = this.querySelectorAll("TD");
            let name = allTd[0].querySelector("P").innerHTML;
            let email = allTd[1].innerHTML;
            let mobile = allTd[2].innerHTML;

            if (name.toLowerCase().indexOf(keyword) !== -1) {

                $(this).removeClass("d-none");
            }
            else if (email.toLowerCase().indexOf(keyword) !== -1) {

                $(this).removeClass("d-none");
            }
            else if (mobile.toLowerCase().indexOf(keyword) !== -1) {

                $(this).removeClass("d-none");
            }
            else {
                $(this).addClass("d-none");
            }
        })
    })
});

// EXPORT CURRENT DATA INTO PDF
$(document).ready(function () {
    $("#current").click(async function (e) {
        e.preventDefault();

        let currentStudent = sessionStorage.getItem("current-student");
        if (currentStudent != null) {
            let token = getCookie("authToken");
            let formData = new FormData();

            formData.append("token", token);
            formData.append("data", currentStudent);

            const request = {
                type: "POST",
                url: "/export-to-pdf",
                data: formData
            }

            try {
                const response = await ajax(request);
                const downloadRequest = {
                    type: "GET",
                    url: "/exports/" + response.filename
                }
                const pdfFile = await ajaxDownloader(downloadRequest);
                const pdfUrl = URL.createObjectURL(pdfFile);
                let a = document.createElement("A");
                a.href = pdfUrl;
                a.download = response.filename;
                a.click();
                a.remove();
                deletePdf(response.filename); // calling...
            } catch (error) {
                console.log(error);
            }

        }
        else {
            swal("Add Student !", "Student Not Found !", "warning");
        }
    })
});

// EXPORT ALL DATA INTO PDF,
$(document).ready(function () {
    $("#all").click(async function (e) {
        e.preventDefault();
        const token = getCookie("authToken");
        const company = decodeToken(token);
        const companyId = company.data.companyInfo._id;
        const studentsRequest = {
            type: "GET",
            url: "/students/all/" + companyId
        }

        const response = await ajax(studentsRequest);
        const allStudents = JSON.stringify(response.data);

        let formData = new FormData();

        formData.append("token", token);
        formData.append("data", allStudents);

        const request = {
            type: "POST",
            url: "/export-to-pdf",
            data: formData
        }

        try {
            const response = await ajax(request);
            const downloadRequest = {
                type: "GET",
                url: "/exports/" + response.filename
            }
            const pdfFile = await ajaxDownloader(downloadRequest);
            const pdfUrl = URL.createObjectURL(pdfFile);
            let a = document.createElement("A");
            a.href = pdfUrl;
            a.download = response.filename;
            a.click();
            a.remove();
            deletePdf(response.filename); // calling...
        } catch (error) {
            console.log(error);
        }
    })
});

// DELETE PDF CODING
const deletePdf = async (filename) => {
    const token = getCookie("authToken");
    const request = {
        type: "DELETE",
        url: "/export-to-pdf/" + filename,
        data: {
            token: token
        }
    }

    await ajax(request);
}