const config = {
    accessKeyId: "AKIAUSH2D7Q2SUDAX4K2",
    secretAccessKey: "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",
    region: "ap-south-1",
    params: {
        Bucket: "jfc-web-files"
    }
}

const s3 = new AWS.S3(config);

// REMOVE CLASSES FUNCTION CODING
const removeClasses = (element, className) => {
    $(element).each(function () {
        $(this).removeClass(className);
    });
}

// CONFIRM FUNCTION CODING
const confirm = (message) => {
    return new Promise((resolve, reject) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    resolve(true);
                    swal(`Poof! Your imaginary file has been ${message} !`, {
                        icon: "success",
                    });
                } else {
                    reject(false);
                    swal("Your imaginary file is safe!");
                }
            });

    });
}

// COMMON GET COOKIE FUNCTION
const getCookie = (tokenName) => {
    const allCookie = document.cookie;
    const cookies = allCookie.split(";");
    let cookieValue = "";

    for (let cookie of cookies) {
        let currentCookie = cookie.split("=");

        if (currentCookie[0].trim() == tokenName) {
            cookieValue = currentCookie[1];
        }
    }

    return cookieValue;
}

// COMMON AJAX FUNCTION
const ajax = (request) => {
    return new Promise((resolve, reject) => {
        let options = {
            type: request.type,
            url: request.url,
            beforeSend: function () {
                if (request.isLoader) {
                    $(request.loaderBtn).removeClass("d-none");
                    $(request.commonBtn).addClass("d-none");
                }
            },
            success: function (response) {
                if (request.isLoader) {
                    $(request.loaderBtn).addClass("d-none");
                    $(request.commonBtn).removeClass("d-none");
                }
                resolve(response);
            },
            error: function (error) {
                if (request.isLoader) {
                    $(request.loaderBtn).addClass("d-none");
                    $(request.commonBtn).removeClass("d-none");
                }
                reject(error);
            }
        }

        if (request.type === 'POST' || request.type === 'PUT') {
            options['data'] = request.data;
            options['processData'] = false;
            options['contentType'] = false;
        }

        if (request.type === 'DELETE') {
            options['data'] = request.data;
        }

        $.ajax(options);
    })
}

// CHECK IN LOCAL STORAGE FUNCTION FOR ALL
const checkInLs = (key) => {
    if (localStorage.getItem(key) != null) {
        let tmp = JSON.parse(localStorage.getItem(key));
        return {
            isExists: true,
            data: tmp
        }
    }
    else {
        return {
            isExists: false
        }
    }
}

// FORMATE DATE FUNCTION CODING
const formateDate = (dateStr) => {
    let date = new Date(dateStr);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    return `${dd}-${mm}-${yy} ${date.toLocaleTimeString()}`;
}

// DECODE TOKEN
const decodeToken = (token) => {
    let payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
}

// UPLOAD FILE ON S3
const uploadFileOnS3 = async (file) => {
    const fileInfo = {
        Key: file.name,
        Body: file,
        ACL: "public-read"
    }

    try {
        const response = await s3.upload(fileInfo)
            .on("httpUploadProgress", (progress) => {
                let total = progress.total;
                let loaded = progress.loaded;
                let percentage = Math.floor((loaded * 100) / total);

                $(".file-name").html(file.name);
                $(".progress-width").css({ width: percentage + "%" });

                // CALCULATE MB
                let totalMb = (total / 1024 / 1024).toFixed(1);
                let loadedMb = (loaded / 1024 / 1024).toFixed(1);

                $(".progress-text").html(`${loadedMb}MB / ${totalMb} MB`);
            })
            .promise();
        return response.Location;
    } catch (error) {
        return error;
    }
}

// AJAX DOWNLOADER
const ajaxDownloader = async (request) => {
    return $.ajax({
        type: request.type,
        url: request.url,
        xhr: () => {
            let xml = new XMLHttpRequest();
            xml.responseType = 'blob';
            return xml;
        }
    }).promise();
}