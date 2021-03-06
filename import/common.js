function includeHTML(element_id, tag) {
    var elmnt, file, xhttp, removeElement;
    /* Loop through a collection of all HTML elements: */
    elmnt = document.getElementById(element_id);
        /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    elmnt.innerHTML = this.responseText;
                    if (tag == 0) { // not login
                        removeElement = document.getElementById("btn_user")
                        removeElement.parentNode.removeChild(removeElement)
                        removeElement = document.getElementById("btn_exit")
                        removeElement.parentNode.removeChild(removeElement)
                        removeElement = document.getElementById("btn_upload")
                        removeElement.parentNode.removeChild(removeElement)
                    } else if (tag == 1) { // user login
                        removeElement = document.getElementById("btn_sign_in")
                        removeElement.parentNode.removeChild(removeElement)
                        removeElement = document.getElementById("btn_sign_up")
                        removeElement.parentNode.removeChild(removeElement)
                        removeElement = document.getElementById("btn_upload")
                        removeElement.parentNode.removeChild(removeElement)
                    } else if (tag == 2) { // logged in but not admin
                        removeElement = document.getElementById("user_manager_btn")
                        removeElement.parentNode.removeChild(removeElement)
                    } else if (tag == 3) { // not login
                        removeElement = document.getElementById("user_manager_btn")
                        removeElement.parentNode.removeChild(removeElement)
                        removeElement = document.getElementById("user_info_btn")
                        removeElement.parentNode.removeChild(removeElement)
                        removeElement = document.getElementById("upload_btn")
                        removeElement.parentNode.removeChild(removeElement)
                    } else if (tag == 4) { // nothing

                    } else if (tag == 5) { // login admin
                        removeElement = document.getElementById("btn_sign_in")
                        removeElement.parentNode.removeChild(removeElement)
                        removeElement = document.getElementById("btn_sign_up")
                        removeElement.parentNode.removeChild(removeElement)
                    }
                }
            }
            if (this.status == 404) {
                elmnt.innerHTML = "Page not found.";
            }
        }
    }
    xhttp.open("GET", file, true);
    xhttp.send();
    /* Exit the function: */
    return;
}