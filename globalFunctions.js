var connection;

$(document).ready(function() {
    $('#restartPage').on('shown.bs.modal', function() {
        // will only come inside after the modal is shown
        timeoutLoading = setTimeout(function() {
                if ($('#restartPage').is(":visible")) {
                    $('#restartPage').modal("hide");
                    showAlert(getString("164"));
                }
            }, 30000);

        let msg = {
            command: "restart_module"
        };

        sendData(msg, $(this));
    });

    $('#leerDatos').on('shown.bs.modal', function() {
        // will only come inside after the modal is shown
        

        timeoutLoading = setTimeout(function() {
                if ($('#leerDatos').is(":visible")) {
                    $('#leerDatos').modal("hide");
                    showAlert(getString("164"));
                }
            }, 3000);

        try {
            msg_recieved = JSON.parse(json_configuration);

            if (isJson(msg_recieved)) {
                
                desactivar_modal_loading_RecieveAll($(this));
                anywhere_to_mainSettings();
                console.log(msg_recieved);
            } else {
                desactivar_modal_loading($(this));
                anywhere_to_error();
            }

            
        } catch (error) {
            desactivar_modal_loading($(this));
            anywhere_to_error();
        }
    });

    $('#enviarDatos').on('shown.bs.modal', function() {

        timeoutLoading = setTimeout(function() {
                if ($('#enviarDatos').is(":visible")) {
                    $('#enviarDatos').modal("hide");
                    showAlert(getString("164"));
                }
            }, 30000);
        let msg = updateFields(msg_recieved);
        msg.command = "write_conf";

        let can_continue = check_all_data(msg); // check data

        let msg_to_send = transformJson(msg);

        if (can_continue == true) {
            sendData(msg_to_send, $(this));
        } else {
            desactivar_modal_loading($(this));

            setTimeout(() => {
                showAlert(can_continue);
            }, 500);

        }
    });

});

function sendDataConfig() {
    alertify.confirm(
        getString("234"),
        getString("162"), //variable
        function() {
            // user clicked "ok"
            activar_modal_loading(getString("52"), false, 'enviarDatos');
        },
        function() {}
    )
    .set('labels', {ok: getString("232"), cancel: getString("233")})
    .set('closable', false)
    .set('movable', false);

}

function sendMod(code) {
    let msg = {
        command: "write_module",
        mod: code
    };

    console.log(`Sending...`);
    console.log(msg);
    console.log(`..........`);

    sendData(msg);

}

function factoryReset() {

    alertify.confirm(
        getString("234"),
        getString("132"), //variable
        function() {
            // user clicked "ok"
            let msg = {
                command: "factory_reset"
            };
    
            console.log(`Sending...`);
            console.log(msg);
            console.log(`..........`);
    
            sendData(msg);
        },
        function() {}
    )
    .set('labels', {ok: getString("232"), cancel: getString("233")})
    .set('closable', false)
    .set('movable', false);

        
    
}


function showAlert(text) {
    alertify.alert(getString("235"),text)
        .set('label', getString("232"))
        .set('closable', false)
        .set('movable', false);
}


function transformJson(msg_old) {

    let comRes = 0;

    if (parseInt(msg_old.main_conf.communicationsResistance) > 1) {
        comRes = parseInt(msg_old.main_conf.communicationsResistance) - 1;
    } else {
        comRes = parseInt(msg_old.main_conf.communicationsResistance);
    }

    let notRespondingAddr = msg_old.main_conf.NotRespAdrss;

    let notRespondingMont = notRespondingAddr == 0 ? 0 : msg_old.main_conf.NotRespMont;


    var msg = {
        command: msg_old.command,
        F1: msg_old.main_conf.technology,
        F2: msg_old.main_conf.backbone,
        F3: msg_old.main_conf.accessnum,
        F4: msg_old.main_conf.mainBoard,
        F5: msg_old.main_conf.general,
        F6: msg_old.main_conf.autoswitchOn,
        F7: msg_old.main_conf.callToCentral,
        F8: msg_old.main_conf.openingTime,
        F9: msg_old.main_conf.offset,
        F10: notRespondingAddr,
        F11: notRespondingMont,
        F12: msg_old.main_conf.withCamera,
        F13: msg_old.main_conf.cameraLight,
        F14: msg_old.main_conf.videoSignal,
        F15: comRes,
        F16: msg_old.main_conf.duskSensor,
        F17: msg_old.main_conf.numberOfEnabledButtons,
        F18: msg_old.main_conf.auxiliaryButton,
        F19: msg_old.main_conf.ConfigPuls,
        F20: msg_old.main_conf.InvertPuls,
        F21: msg_old.main_conf.InvertCol,
        F22: msg_old.main_conf.callTones,
        F23: msg_old.main_conf.toneVolume,
        F24: msg_old.main_conf.activatedSynthesis,
        F25: msg_old.main_conf.sintesisLanguage,
        F26: msg_old.main_conf.synthesisVolumeHigh,
        F27: msg_old.main_conf.id_exp_btn0,
        F28: msg_old.main_conf.mont_btn0,
        F29: msg_old.main_conf.address_btn0,
        F30: msg_old.main_conf.id_exp_btn1,
        F31: msg_old.main_conf.mont_btn1,
        F32: msg_old.main_conf.address_btn1,
        F33: msg_old.main_conf.cameraOrientation
    }
    var index_v2_2 = 0;
    var counter = 0;
    var start = 34;
    for (let index = 0; index < 22; index++) {
        for (let indexv2 = 1; indexv2 < 7; indexv2++) {
            if (msg_old.main_conf.technology == 2) {
                msg["F".concat(start + counter)] = msg_old.modules[index_v2_2]['P'.concat(indexv2)].id;
                msg["F".concat(start + counter + 1)] = 255;
                if (msg_old.main_conf.ConfigPuls == 0) {
                    msg["F".concat(start + counter + 2)] = 65535;
                } else {
                    msg["F".concat(start + counter + 2)] = msg_old.modules[index_v2_2]['P'.concat(indexv2)].direccion;
                }

            } else {
                msg["F".concat(start + counter)] = msg_old.modules[index_v2_2]['P'.concat(indexv2)].id;

                if (msg_old.main_conf.ConfigPuls == 0) {
                    msg["F".concat(start + counter + 1)] = 255;
                    msg["F".concat(start + counter + 2)] = 65535;
                } else {
                    console.log(msg_old.modules[index_v2_2]['P'.concat(indexv2)].direccion == 65535);
                    msg["F".concat(start + counter + 1)] = msg_old.modules[index_v2_2]['P'.concat(indexv2)].montante;
                    msg["F".concat(start + counter + 2)] = msg_old.modules[index_v2_2]['P'.concat(indexv2)].direccion;
                    if (msg_old.modules[index_v2_2]['P'.concat(indexv2)].direccion >= 1000 && msg_old.modules[index_v2_2]['P'.concat(indexv2)].montante <= 254) {
                        msg["F".concat(start + counter + 2)] = msg_old.modules[index_v2_2]['P'.concat(indexv2)].direccion_def;
                    }else if(msg_old.modules[index_v2_2]['P'.concat(indexv2)].direccion <= 999 && msg_old.modules[index_v2_2]['P'.concat(indexv2)].montante >= 255){
                        msg["F".concat(start + counter + 1)] = 255;
                        msg["F".concat(start + counter + 2)] = 65535;
                    }
                }
            }

            counter += 3;
        }
        index_v2_2++;
    }
    console.log(msg);
    return msg;
}

function check_all_data(msg) {
    var can_continue = true;

    console.log(msg.main_conf);

    if (!check_number_and_range(msg.main_conf.technology, 0, 2)) {
        can_continue = getString("133");
    } else if (!check_number_and_range(msg.main_conf.backbone, 0, 250)) {
        can_continue = getString("134");
    } else if (!check_number_and_range(msg.main_conf.mainBoard, 0, 1)) {
        can_continue = getString("135");
    } else if (!check_number_and_range(msg.main_conf.general, 0, 1)) {
        can_continue = getString("136");
    } else if (!check_number_and_range(msg.main_conf.videoSignal, 0, 1)) {
        can_continue = getString("137");
    } else if (!check_number_and_range(msg.main_conf.autoswitchOn, 0, 1)) {
        can_continue = getString("138");
    } else if (!check_number_and_range(msg.main_conf.withCamera, 0, 1)) {
        can_continue = getString("139");
    } else if (!check_number_and_range(msg.main_conf.cameraLight, 0, 1)) {
        can_continue = getString("140");
    } else if (!check_number_and_range(msg.main_conf.openingTime, 0, 99)) {
        can_continue = getString("141");
    } else if (!check_number_and_range(msg.main_conf.numberOfEnabledButtons, 0, 1)) {
        can_continue = getString("142");
    } else if (!check_number_and_range(msg.main_conf.callTones, 0, 1)) {
        can_continue = getString("143");
    } else if (!check_number_and_range(msg.main_conf.toneVolume, 0, 1)) {
        can_continue = getString("144");
    } else if (!check_number_and_range(msg.main_conf.callToCentral, 0, 1)) {
        can_continue = getString("145");
    } else if (!check_number_and_range(msg.main_conf.sintesisLanguage, 0, 4)) {
        can_continue = getString("146");
    } else if (!check_number_and_range(msg.main_conf.activatedSynthesis, 0, 1)) {
        can_continue = getString("147");
    } else if (!check_number_and_range(msg.main_conf.synthesisVolumeHigh, 0, 1)) {
        can_continue = getString("148");
    } else if (!check_number_and_range(msg.main_conf.duskSensor, 0, 1)) {
        can_continue = getString("149");
    } else if (!check_number_and_range(msg.main_conf.auxiliaryButton, 0, 1)) {
        can_continue = getString("150");
    } else if (!check_number_and_range(msg.main_conf.ConfigPuls, 0, 1)) {
        can_continue = getString("151");
    } else if (!check_number_and_range(msg.main_conf.InvertCol, 0, 1)) {
        can_continue = getString("152");
    } else if (!check_number_and_range(msg.main_conf.InvertPuls, 0, 1)) {
        can_continue = getString("153");
    } else if (!check_number_and_range(msg.main_conf.offset, 0, 131)) {
        can_continue = getString("154");
    } else if (!check_number_and_range(msg.main_conf.cameraOrientation, 0, 9)) {
        can_continue = getString("155");
    }

    switch (msg.main_conf.technology) {
        case 0:
        case 1:

            if (!isNaN(msg.main_conf.communicationsResistance) && msg.main_conf.communicationsResistance != 0 &&
                !isNaN(msg.main_conf.communicationsResistance) && msg.main_conf.communicationsResistance != 2 &&
                !isNaN(msg.main_conf.communicationsResistance) && msg.main_conf.communicationsResistance != 3) {
                can_continue = getString("156");
            }

            console.log(`error: ${can_continue}`);


            if (!check_number_and_range(msg.main_conf.NotRespAdrss, 0, 999)) {
                can_continue = getString("157");
            }

            if (!check_number_and_range(msg.main_conf.NotRespMont, 0, 250)) {
                can_continue = getString("158");
            }

            break;
        case 2: //R5
            if (!check_number_and_range(msg.main_conf.communicationsResistance, 0, 1)) {
                can_continue = getString("159");
            }
            console.log(msg.main_conf.communicationsResistance);

            if (!check_number_and_range(msg.main_conf.NotRespAdrss, 0, 255)) {
                can_continue = getString("160");
            }

            break;
    }
    return can_continue;

}

function validateHhMm(inputField) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField.value);

    return isValid;
}

function check_number_and_range(val, min, max) {
    if (!isNaN(val) && val >= min && val <= max) {
        return true;
    }
    return false
}

function makeFileAndDownload() {
    var var_to_send = updateFields(msg_recieved);
    var_to_send.type = TYPE_MODULE;
    download(var_to_send, 'configuration.json', 'application/json');
}

function updateFields(msg_recieved_new) {

    var returned = msg_recieved_new;

    let vocalMessage = parseInt($("#vocalMessage").children("option:selected").attr('valorSend'));

    let volume = parseInt($("#toneVolume").children("option:selected").attr('valorSend'));
    let activatedSynthesis = vocalMessage == 2 ? 1 : 0;
    let callTones = vocalMessage == 1 ? 1 : 0;

    let notRespondingAddr = parseInt($("#NotRespondingAddr").val());
    let notRespondingMont = parseInt($("#NotRespondingMont").val());
    if (notRespondingAddr == 0) {
        notRespondingMont = 0;
    }

    //SETTINGS SCREEN
    returned.main_conf.technology = parseInt($("#technology").children("option:selected").attr('valorSend'));
    returned.main_conf.backbone = parseInt($("#backbone").val());
    returned.main_conf.mainBoard = parseInt($("#mainBoard").children("option:selected").attr('valorSend'));
    returned.main_conf.general = parseInt($("#general").children("option:selected").attr('valorSend'));
    returned.main_conf.autoswitchOn = parseInt($("#autoswitchOn").children("option:selected").attr('valorSend'));
    returned.main_conf.callToCentral = parseInt($("#callToCentral").children("option:selected").attr('valorSend'));
    returned.main_conf.openingTime = parseInt($("#openingTimePlusR5").val());
    returned.main_conf.NotRespAdrss = notRespondingAddr;
    returned.main_conf.NotRespMont = notRespondingMont;
    returned.main_conf.withCamera = parseInt($("#withCamera").children("option:selected").attr('valorSend'));
    returned.main_conf.cameraLight = parseInt($("#cameraLight").children("option:selected").attr('valorSend'));
    returned.main_conf.videoSignal = parseInt($("#videoSignal").children("option:selected").attr('valorSend'));
    returned.main_conf.communicationsResistance = parseInt($("#communicationsResistance").children("option:selected").attr('valorSend'));
    returned.main_conf.duskSensor = parseInt($("#duskSensor").children("option:selected").attr('valorSend'));
    returned.main_conf.numberOfEnabledButtons = parseInt($("#localLights").children("option:selected").attr('valorSend'));
    returned.main_conf.auxiliaryButton = parseInt($("#auxiliaryButton").children("option:selected").attr('valorSend'));
    //returned.main_conf.InvertPuls = $("#InvertPuls").prop('checked') == true ? 1 : 0;
    //returned.main_conf.InvertCol = $("#InvertCols").prop('checked') == true ? 1 : 0;
    returned.main_conf.callTones = callTones;
    returned.main_conf.toneVolume = volume;
    returned.main_conf.activatedSynthesis = activatedSynthesis;
    returned.main_conf.sintesisLanguage = parseInt($("#sintesisLanguage").children("option:selected").attr('valorSend'));
    returned.main_conf.synthesisVolumeHigh = volume;
    returned.main_conf.ConfigPuls = parseInt($("#ConfigPuls").children("option:selected").attr('valorSend'));
    returned.main_conf.offset = parseInt($("#offsetField").val());
    returned.main_conf.cameraOrientation = parseInt($("#cameraVideoCuadrante").children("option:selected").attr('valorSend'));

    if (returned.main_conf.technology == 0 || returned.main_conf.technology == 1) {
        if (returned.main_conf.general == 1) {
            returned.main_conf.backbone = 0;
        }
    }

    //MODULES

    return returned;
}

function setFirstButton() {
    var back_val = parseInt($("#MontBtn").val());
    var addr_val = parseInt($("#AddrBtn").val());
    var tech = parseInt($("#technology").children("option:selected").attr('valorSend'));
    let idButton = $("#name_button").val();
    const btnNum = idButton.charAt(idButton.length - 1);
    console.log(`name_button: ${idButton}`);
    if (tech == 0 || tech == 1) { //plus
        if (back_val < 0 || back_val > 250) {
            showAlert(getString('79'));
            return;
        } else if (addr_val < 1 || addr_val > 999) {
            showAlert(getString('81'));
            return;
        } else if (isNaN(addr_val) || isNaN(back_val)) {
            showAlert(getString('82'));
            return;
        }



        switch (idButton) {
            case "id_exp_btn0":
            case "id_exp_btn1":
                msg_recieved.main_conf[`mont_btn${btnNum}`] = back_val;
                msg_recieved.main_conf[`address_btn${btnNum}`] = addr_val;
                break;

            default:
                let modulo = idButton.split("P");
                modulo[0] = modulo[0].replace("M", "");

                msg_recieved.modules[`${modulo[0]}`][`P${modulo[1]}`][`montante`] = back_val;
                msg_recieved.modules[`${modulo[0]}`][`P${modulo[1]}`][`direccion`] = addr_val;
                break;
        }


    } else if (tech == 2) { //R5
        if (addr_val < 1 || addr_val > 250) {
            showAlert(getString('80'));
            return;
        } else if (isNaN(addr_val)) {
            showAlert(getString('82'));
            return;
        }

        switch (idButton) {
            case "id_exp_btn0":
            case "id_exp_btn1":
                msg_recieved.main_conf[`mont_btn${btnNum}`] = 0;
                msg_recieved.main_conf[`address_btn${btnNum}`] = parseInt($("#AddrBtn").val());
                break;

            default:
                let modulo_r5 = idButton.split("P");
                modulo_r5[0] = modulo_r5[0].replace("M", "");

                msg_recieved.modules[`${modulo_r5[0]}`][`P${modulo_r5[1]}`][`montante`] = 0;
                msg_recieved.modules[`${modulo_r5[0]}`][`P${modulo_r5[1]}`][`direccion`] = addr_val;
                break;
        }
    }

    //let firstArrow = document.getElementById("arrow_id_exp_btn0");
    //let secondArrow = document.getElementById("arrow_id_exp_btn1");
    let arrow = document.getElementById(`arrow_${idButton}`);

    switch (idButton) {
        case "id_exp_btn0":
            console.log("id_exp_btn0");
            arrow.innerHTML = `${msg_recieved.main_conf.mont_btn0}-${msg_recieved.main_conf.address_btn0}`;
            break;
        case "id_exp_btn1":
            console.log("id_exp_btn1");

            arrow.innerHTML = `${msg_recieved.main_conf.mont_btn1}-${msg_recieved.main_conf.address_btn1}`;
            break;

        default:
            let modulo_r5 = idButton.split("P");
            modulo_r5[0] = modulo_r5[0].replace("M", "");
            arrow.innerHTML = `${msg_recieved.modules[`${modulo_r5[0]}`][`P${modulo_r5[1]}`][`montante`]}-${msg_recieved.modules[`${modulo_r5[0]}`][`P${modulo_r5[1]}`][`direccion`]}`;
            break;
    }

    $("#modalButtons").modal('toggle');

}


function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content, null, 2)], {
        type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function setPageFromUrl(pageToGo) {
    var maxPage = parseInt(msg_recieved.main_conf.nummodbut);
    pageToGo = parseInt(pageToGo);
    if (maxPage >= pageToGo) {
        goToPage(pageToGo);
    }
}


function nextPage() {
    if (parseInt(msg_recieved.main_conf.nummodbut) > 1) {
        var currentPage = location.href.substring(location.href.lastIndexOf("?") + 1);
        var nextPage = parseInt(currentPage) + 1;
        var maxPage = parseInt(msg_recieved.main_conf.nummodbut);

        if (maxPage >= nextPage) {
            location.href = "#controlAccess?" + nextPage;
            setPageFromUrl(nextPage);
        } else if (maxPage == currentPage) {
            location.href = "#controlAccess?" + 1;
            setPageFromUrl(1);
        }
    }
    
}

function nextPageToLast() {
    if (parseInt(msg_recieved.main_conf.nummodbut) > 1) {
        var maxPage = parseInt(msg_recieved.main_conf.nummodbut);
        location.href = "#controlAccess?" + maxPage;
        setPageFromUrl(maxPage);
    }
}

function previousPage() {
    if (parseInt(msg_recieved.main_conf.nummodbut) > 1) {
        var currentPage = location.href.substring(location.href.lastIndexOf("?") + 1);
        var previousPage = parseInt(currentPage) - 1;
        var maxPage = parseInt(msg_recieved.main_conf.nummodbut);

        if (previousPage > 0) {
            location.href = "#controlAccess?" + previousPage;
            setPageFromUrl(previousPage);
        } else if (currentPage == 1) {
            location.href = "#controlAccess?" + maxPage;
            setPageFromUrl(maxPage);
        }
    }
}

function previousPageToOne() {
    if (parseInt(msg_recieved.main_conf.nummodbut) > 1) {
        var minPage = 1;
        location.href = "#controlAccess?" + minPage;
        setPageFromUrl(minPage);
    }
}

function anywhere_to_mainSettings() {
    $("#transferButton").removeClass("buttonOn");
    $("#controlAccessButton").removeClass("buttonOn");
    $("#mainSettingsButton").removeClass("buttonOn");
    $("#mainSettingsButton").removeClass("buttonOff");
    $("#mainSettings").css("display", "block");
    $("#controlAccess").css("display", "none");
    $("#transfer").css("display", "none");
    $("html, body").animate({
        scrollTop: 0
    }, "fast");
    $("#transferButton").addClass("buttonOff");
    $("#controlAccessButton").addClass("buttonOff");
    $("#mainSettingsButton").addClass("buttonOn");
    $("#errorSec").hide();
    $("#footer").show();

    let locationPage = location.href.substring(location.href.lastIndexOf("#") + 1);
    
    if (!locationPage.includes("mainSettings")) {
        sendMod(255);
        location.href = "#mainSettings";
    }
    


}

function anywhere_to_controlAccess() {
    $("#transferButton").removeClass("buttonOn");
    $("#mainSettingsButton").removeClass("buttonOn");
    $("#controlAccessButton").removeClass("buttonOn");
    $("#controlAccessButton").removeClass("buttonOff");
    $("#mainSettings").css("display", "none");
    $("#controlAccess").css("display", "block");
    $("#transfer").css("display", "none");
    $("html, body").animate({
        scrollTop: 0
    }, "fast");
    $("#transferButton").addClass("buttonOff");
    $("#mainSettingsButton").removeClass("buttonOff");
    $("#controlAccessButton").addClass("buttonOn");
    $("#errorSec").hide();
    $("#footer").show();

    
    let locationPage = location.href.substring(location.href.lastIndexOf("#") + 1);
    if (!locationPage.includes("controlAccess")) {
        location.href = "#controlAccess?1";
        var currentPage = location.href.substring(location.href.lastIndexOf("?") + 1);
        setPageFromUrl(currentPage);
    }

   
    
}

function anywhere_to_transfer() {
    $("#mainSettingsButton").removeClass("buttonOn");
    $("#controlAccessButton").removeClass("buttonOn");
    $("#transferButton").removeClass("buttonOn");
    $("#transferButton").removeClass("buttonOff");
    $("#mainSettings").css("display", "none");
    $("#controlAccess").css("display", "none");
    $("#transfer").css("display", "block");
    $("html, body").animate({
        scrollTop: 0
    }, "fast");
    $("#transferButton").addClass("buttonOn");
    $("#controlAccessButton").addClass("buttonOff");
    $("#mainSettingsButton").removeClass("buttonOff");
    $("#errorSec").hide();
    $("#footer").show();

    let locationPage = location.href.substring(location.href.lastIndexOf("#") + 1);
    if (!locationPage.includes("transfer")) {
        sendMod(255);
        location.href = "#transfer";
    }
}

function anywhere_to_error() {
    $("#transferButton").removeClass("buttonOn");
    $("#controlAccessButton").removeClass("buttonOn");
    $("#mainSettingsButton").removeClass("buttonOn");
    $("#mainSettings").css("display", "none");
    $("#controlAccess").css("display", "none");
    $("#transfer").css("display", "none");
    $("html, body").animate({
        scrollTop: 0
    }, "fast");
    $("#transferButton").addClass("buttonOff");
    $("#mainSettingsButton").addClass("buttonOff");
    $("#controlAccessButton").addClass("buttonOff");
    $("#footer").hide();
    $("#errorSec").show();
    location.href = "#errorScr";

}

function isJson(item) {
    item = typeof item !== "string" ?
        JSON.stringify(item) :
        item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

}

function desactivar_modal_loading_RecieveAll(modal) {


    checkTecnology(msg_recieved.main_conf.mainBoard);
    setDataToFields();
    structPage(true);

    switch (msg_recieved.main_conf.technology) {
        case 0:
        case 1:
            $(".direccionModal").attr("placeholder", "1-999");
            $(".direccionModal").attr("max", "999");
            break;
        case 2:
            $(".direccionModal").attr("placeholder", "1-250");
            $(".direccionModal").attr("max", "250");
            break;
    }

    //checkAdvButt();

    checkBtns(false);

    clearTimeoutLoading();
    modal.modal('hide');
}

function desactivar_modal_loading(modal) {
    clearTimeoutLoading();
    modal.modal('hide');
}


function activar_modal_loading(message, hideDipsVal, modal) {
    $(".Loading1Text").html(message);

    $(`#${modal}`).modal({
        backdrop: "static", //remove ability to close modal with click
        keyboard: false, //remove option to close with keyboard
        show: true //Display loader!
    });

    if (hideDipsVal == true) {
        hideDips();
    }

    return true;
}


function getFile(nameUpButton) {

    $('#' + nameUpButton).click();
}



function sub(obj, nameBtn) {
    var file = obj.value;
    var fileName = file.split("\\");
    document.getElementById(nameBtn).innerHTML = fileName[fileName.length - 1];

    var fr = new FileReader();
    fr.onload = function() {
        document.getElementById('output')
            .textContent = fr.result;
    }

}

function clearTimeoutLoading() {
    clearTimeout(timeoutLoading);
    timeoutLoading = null;
}

function closeModalLoading(modal) {
    if (modal != null) {
        if (modal.is(':visible')) {
            desactivar_modal_loading(modal);
        }
    } else {
        $('.loadingModal').modal('hide');
    }
}

function sendData(json_msg, modal = null) {

    if (connection) {
        //return;
        connection.close();
    }

    //connection = new WebSocket('ws://192.168.1.254:81/', ['arduino']);
    //connection = new WebSocket('ws://192.168.1.254:81/');

    connection = new WebSocket('ws://' + ip_address + ':81/', ['arduino']);
    connection.onopen = () => {

        SendDataJson(json_msg);
    };

    connection.onerror = (error) => {
        console.log("ERROR");
        if ( timeoutLoading != null ) {
            clearTimeoutLoading();
            showAlert(getString("163"));
        }
        closeModalLoading(modal);
    };

    connection.onmessage = function(event) {
        temp_msg = JSON.parse(event.data);
        console.log(temp_msg);
        if (isJson(temp_msg)) {
            switch (temp_msg.command) {
                case "write_json":
                    if (temp_msg.code == 1) {
                        connection.close();
                        connection = undefined;
                        showAlert(getString("54"));
                    } else {
                        showAlert(getString("53"));
                    }

                    desactivar_modal_loading(modal);

                    break;
                case "restart_module":
                    desactivar_modal_loading(modal);
                    location.href = '#mainSettings';
                    location.reload();
                    break;
                case "close_conn":
                    connection.close();
                    connection = undefined;
                    break;
                default:
                    break;
            }
        }
    };

    connection.onclose = function(evt) {
        console.log("DISCONNECTED");
        if (connection) {
            connection.close();
            connection = undefined;
        }

        if ( timeoutLoading != null ) {
            console.log(timeoutLoading);
            showAlert(getString("163"));
            clearTimeoutLoading();
        }

        closeModalLoading(modal);
    };

}




function SendDataJson(json_msg) {
    if (connection) {
        connection.send(JSON.stringify(json_msg));
    } else {
        console.log('ERROR SENDIND MESSAGE');
    }

}

function checkBackbone() {

    var tech = parseInt($("#technology").children("option:selected").attr('valorSend'));
    var advancedButtonSettings = $("#ConfigPuls").children("option:selected").attr('valorSend');
    if (tech == 0 || tech == 1) {
        $('.backboneContainer').show();
        if (advancedButtonSettings == "0") {
            console.log("Adv disp: " + (advancedButtonSettings == "0"));
            $('.montanteModal ').attr('disabled', true);
            $('.direccionModal ').attr('disabled', true);

        } else if (advancedButtonSettings == "1") {
            console.log("Adv disp: " + advancedButtonSettings == "1");

            $('.montanteModal ').attr('disabled', false);
            $('.direccionModal ').attr('disabled', false);
        }
    } else if (tech == 2) {
        $('.montanteModal ').val(255);
        $('#MontBtn1screen1').val(0);
        $('#MontBtn2screen1').val(0);
        $('.backboneContainer').hide();
        $('.montanteModal ').attr('disabled', true);
        $('#backbone').val(0);
        $('#backbone').change();
    }

    lookForGeneral();
}

function structPage(buttons) {
    if (buttons == true) {
        //struct_buttons();
        struct_buttons();
    }

    checkBackbone();

}



function goToPage(pageNumber) {
    if (pageNumber == 1) {
        sendMod(240);
    } else {
        sendMod(parseInt(pageNumber) - 2);
    }
    $('.buttons_div').hide();
    $('#button_screen_' + pageNumber).show();
    var spanChanged = $('#currentNumber');
    spanChanged.html(pageNumber);
}

function openmodal(idmodal, idButton) {
    console.log(`id button: ${idButton}`);

    switch (idButton) {
        case "id_exp_btn0":
            let montante_btn0 = parseInt(msg_recieved.main_conf.mont_btn0);

            $("#IdBtn").val(msg_recieved.main_conf.id_exp_btn0+1);
            $("#FunctEsp").val($("#FunctEsp option:first").val());
            $("#AddrBtn").val(msg_recieved.main_conf.address_btn0);
            $("#name_button").val("id_exp_btn0");

            if (montante_btn0 == 255) {
                $("#MontBtn").val(0);
            } else {
                $("#MontBtn").val(msg_recieved.main_conf.mont_btn0);
            }

            break;

        case "id_exp_btn1":

            let montante_btn1 = parseInt(msg_recieved.main_conf.mont_btn1);

            $("#IdBtn").val(msg_recieved.main_conf.id_exp_btn1+1);
            $("#FunctEsp").val($("#FunctEsp option:first").val());
            $("#AddrBtn").val(msg_recieved.main_conf.address_btn1);
            $("#name_button").val("id_exp_btn1");

            if (montante_btn1 == 255) {
                $("#MontBtn").val(0);
            } else {
                $("#MontBtn").val(msg_recieved.main_conf.mont_btn1);
            }

            break;

        default:

            let push_btn = idButton.split("P");
            push_btn[0] = push_btn[0].replace('M', '');
            let montante = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`montante`]);
            let direccion = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`direccion`]);
            let direccion_def = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`direccion_def`]);

            $("#IdBtn").val(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`id`]+1);
            $("#name_button").val(`M${push_btn[0]}P${push_btn[1]}`);

            //$("#FunctEsp").val($("#FunctEsp option:first").val());
            //let montante = document.getElementById("MontBtn");
            //montante.value = montante;


            if ((montante >= 255 && direccion >= 1000) || (montante >= 255 && direccion <= 1000)) {
                $("#MontBtn").val(0);
                $("#AddrBtn").val(direccion_def);
            }else if(montante <= 254 && direccion >= 1000){
                $("#MontBtn").val(montante);
                $("#AddrBtn").val(direccion_def);
            }else{
                $("#MontBtn").val(montante);
                $("#AddrBtn").val(direccion);
            }

            break;
    }

    $("#" + idmodal).modal();
}

function set_modal_buttons() {
    $('#inserted_modals_group').empty();

    let container = document.getElementById("inserted_modals_group");
    let div_modal = document.createElement("div");
    div_modal.className = "modal fade centered buttonModalClass";
    div_modal.id = "modalButtons";
    div_modal.tabIndex = "-1";
    div_modal.setAttribute("role", "dialog");
    div_modal.setAttribute("aria-hidden", "true");

    let div_modal_2nd = document.createElement("div");
    div_modal_2nd.className = "modal-dialog unset_centered"
    div_modal_2nd.setAttribute("role", "document");

    let div_modal_3rd = document.createElement("div");
    div_modal_3rd.className = "modal-content";

    //PRIMER DIV INTO
    let div_header_modal = document.createElement("div");
    div_header_modal.className = "modal-header";

    let h5_header_modal = document.createElement("h5");
    h5_header_modal.className = "modal-title lcBtn";
    h5_header_modal.id = "ModalLabel";
    h5_header_modal.innerHTML = getString("7");


    let button_header_modal = document.createElement("button");
    button_header_modal.type = "button";
    button_header_modal.className = "close";
    button_header_modal.setAttribute("data-dismiss", "modal");
    button_header_modal.setAttribute("aria-label", "Close");

    let span_header_modal = document.createElement("span");
    span_header_modal.setAttribute("aria-hidden", "true");
    span_header_modal.innerHTML = "&times;";
    //FIN PRIMER DIV

    //SEGUNDO DIV INTO
    let div_body_container = document.createElement("div");
    div_body_container.className = "modal-body";

    let div_body_d2_container = document.createElement("div");
    div_body_d2_container.className = "md-form";

    let div_body_form_d1 = document.createElement("div");
    div_body_form_d1.className = "form-group";
    let label_div_body_form_d1 = document.createElement("label");
    label_div_body_form_d1.className = "id_btn_lab";
    label_div_body_form_d1.setAttribute("for", "IdBtn");
    label_div_body_form_d1.innerHTML = getString("55");
    let input_div_body_form_d1 = document.createElement("input");
    input_div_body_form_d1.type = "number";
    input_div_body_form_d1.className = "form-control";
    input_div_body_form_d1.id = "IdBtn";
    input_div_body_form_d1.disabled = true;
    input_div_body_form_d1.min = "1";
    input_div_body_form_d1.max = "23";
    div_body_form_d1.appendChild(label_div_body_form_d1);
    div_body_form_d1.appendChild(input_div_body_form_d1);

    let div_body_form_d2 = document.createElement("div");
    div_body_form_d2.className = "form-group";
    let label_div_body_form_d2 = document.createElement("label");
    label_div_body_form_d2.className = "sp_fnc_lab";
    label_div_body_form_d2.setAttribute("for", "FunctEsp");
    label_div_body_form_d2.innerHTML = getString("56");
    let select_div_body_form_d2 = document.createElement("select");
    select_div_body_form_d2.disabled = true;
    select_div_body_form_d2.id = "FunctEsp";
    select_div_body_form_d2.className = "form-control sp_fts";
    let option_modal = document.createElement("option");
    option_modal.className = "label_cl_apt";
    option_modal.selected = true;
    option_modal.innerHTML = getString("57");
    select_div_body_form_d2.appendChild(option_modal);
    div_body_form_d2.appendChild(label_div_body_form_d2);
    div_body_form_d2.appendChild(select_div_body_form_d2);

    let div_body_form_d3 = document.createElement("div");
    div_body_form_d3.className = "form-group";
    let label_div_body_form_d3 = document.createElement("label");
    label_div_body_form_d3.className = "mt_btn_lab";
    label_div_body_form_d3.setAttribute("for", "MontBtn");
    label_div_body_form_d3.innerHTML = getString("11");
    let input_div_body_form_d3 = document.createElement("input");
    input_div_body_form_d3.type = "number";
    input_div_body_form_d3.className = "form-control montanteModal montante";
    input_div_body_form_d3.id = "MontBtn";
    input_div_body_form_d3.min = "0";
    input_div_body_form_d3.max = "250";
    input_div_body_form_d3.name = "backbone";
    input_div_body_form_d3.setAttribute("placeholder", "0-250");
    div_body_form_d3.appendChild(label_div_body_form_d3);
    div_body_form_d3.appendChild(input_div_body_form_d3);

    let div_body_form_d4 = document.createElement("div");
    div_body_form_d4.className = "form-group";
    let label_div_body_form_d4 = document.createElement("label");
    label_div_body_form_d4.className = "as_btn_lab";
    label_div_body_form_d4.setAttribute("for", "AddrBtn");
    label_div_body_form_d4.innerHTML = getString("73");
    let input_div_body_form_d4 = document.createElement("input");
    input_div_body_form_d4.type = "number";
    input_div_body_form_d4.className = "form-control direccionModal";
    input_div_body_form_d4.id = "AddrBtn";
    input_div_body_form_d4.name = "address";

    switch (msg_recieved.main_conf.technology) {
        case 0:
            
            break;
    
        case 1:
            input_div_body_form_d4.min = "1";
            input_div_body_form_d4.max = "999";
            input_div_body_form_d4.setAttribute("placeholder", "1-999");
            break;
        case 2:
            input_div_body_form_d4.min = "1";
            input_div_body_form_d4.max = "250";
            input_div_body_form_d4.setAttribute("placeholder", "1-250");
            break;
    }


    div_body_form_d4.appendChild(label_div_body_form_d4);
    div_body_form_d4.appendChild(input_div_body_form_d4);
    //FIN SEGUNDO DIV

    let hidden_name_button = document.createElement("input");
    hidden_name_button.type = "hidden";
    hidden_name_button.id = "name_button";
    hidden_name_button.value = "";

    //TERCER DIV INTO
    let div_footer_modal = document.createElement("div");
    div_footer_modal.className = "modal-footer";

    let button_footer_b1_modal = document.createElement("button");
    button_footer_b1_modal.type = "button";
    button_footer_b1_modal.className = "btn btn-secondary close_label_mdal";
    button_footer_b1_modal.setAttribute("data-dismiss", "modal");
    button_footer_b1_modal.innerHTML = getString("109");


    let button_footer_b2_modal = document.createElement("button");
    button_footer_b2_modal.type = "button";
    button_footer_b2_modal.className = "btn btn-primary save_label_mdal";
    button_footer_b2_modal.innerHTML = getString("108");
    button_footer_b2_modal.onclick = function() {
        setFirstButton()
    }

    div_footer_modal.appendChild(button_footer_b1_modal);
    div_footer_modal.appendChild(button_footer_b2_modal);

    div_body_d2_container.appendChild(div_body_form_d1);
    div_body_d2_container.appendChild(div_body_form_d2);
    div_body_d2_container.appendChild(div_body_form_d3);
    div_body_d2_container.appendChild(div_body_form_d4);

    div_body_container.appendChild(div_body_d2_container);

    button_header_modal.appendChild(span_header_modal);
    div_header_modal.appendChild(h5_header_modal);
    div_header_modal.appendChild(button_header_modal);

    div_modal_3rd.appendChild(div_header_modal);
    div_modal_3rd.appendChild(div_body_container);
    div_modal_3rd.appendChild(hidden_name_button);
    div_modal_3rd.appendChild(div_footer_modal);

    div_modal_2nd.appendChild(div_modal_3rd);
    div_modal.appendChild(div_modal_2nd);

    container.appendChild(div_modal);

    //FIN TERCER DIV

}

function struct_buttons() {



    $('#module_pages').empty();
    let lastNumber = parseInt(msg_recieved.main_conf.nummodbut);

    let container = document.getElementById("module_pages");
    //let paginationBtns = document.createElement("div");

    let li_first = document.createElement("li");
    li_first.className = "page-item";
    li_first.id = "previousPageToOne";
    let link_li_first = document.createElement("a");
    link_li_first.id = "linkPreviousPageToOne";
    link_li_first.className = "page-link buttonPage";
    link_li_first.setAttribute("aria-label", "Previous");
    link_li_first.onclick = function() {
        previousPageToOne()
    };
    let span_li_first = document.createElement("span");
    span_li_first.setAttribute("aria-hidden", true);
    span_li_first.innerHTML = "&lt;&lt;";
    let s2span_li_first = document.createElement("span");
    s2span_li_first.className = "sr-only";
    s2span_li_first.innerHTML = "Previous";
    link_li_first.appendChild(span_li_first);
    link_li_first.appendChild(s2span_li_first);
    li_first.appendChild(link_li_first);

    let li_second = document.createElement("li");
    li_second.className = "page-item";
    li_second.id = "previousPage";
    let link_li_second = document.createElement("a");
    link_li_second.id = "linkPreviousPage";
    link_li_second.className = "page-link buttonPage";
    link_li_second.setAttribute("aria-label", "Previous");
    link_li_second.onclick = function() {
        previousPage()
    };
    let span_li_second = document.createElement("span");
    span_li_second.setAttribute("aria-hidden", true);
    span_li_second.innerHTML = "&lt;";
    let s2span_li_second = document.createElement("span");
    s2span_li_second.className = "sr-only";
    s2span_li_second.innerHTML = "Previous";
    link_li_second.appendChild(span_li_second);
    link_li_second.appendChild(s2span_li_second);
    li_second.appendChild(link_li_second);

    let li_third = document.createElement("li");
    li_third.className = "page-item";
    let link_li_third = document.createElement("a");
    link_li_third.className = "page-link buttonPage";
    let span_li_third = document.createElement("span");
    span_li_third.id = "currentNumber";
    span_li_third.innerHTML = "1";
    let s2span_li_third = document.createElement("span");
    s2span_li_third.id = "currentNumberWordIn";
    s2span_li_third.innerHTML = getString("72");
    let s3span_li_third = document.createElement("span");
    s3span_li_third.id = "lastNumber";
    s3span_li_third.innerHTML = lastNumber;
    link_li_third.appendChild(span_li_third);
    link_li_third.appendChild(s2span_li_third);
    link_li_third.appendChild(s3span_li_third);
    li_third.appendChild(link_li_third);


    let li_fourth = document.createElement("li");
    li_fourth.className = "page-item";
    li_fourth.id = "nextPage";
    let link_li_fourth = document.createElement("a");
    link_li_fourth.id = "linkNextPage";
    link_li_fourth.className = "page-link buttonPage";
    link_li_fourth.setAttribute("aria-label", "Next");
    link_li_fourth.onclick = function() {
        nextPage()
    };
    let span_li_fourth = document.createElement("span");
    span_li_fourth.setAttribute("aria-hidden", true);
    span_li_fourth.innerHTML = "&gt;";
    let s2span_li_fourth = document.createElement("span");
    s2span_li_fourth.className = "sr-only";
    s2span_li_fourth.innerHTML = "Next";
    link_li_fourth.appendChild(span_li_fourth);
    link_li_fourth.appendChild(s2span_li_fourth);
    li_fourth.appendChild(link_li_fourth);

    let li_fifth = document.createElement("li");
    li_fifth.className = "page-item";
    li_fifth.id = "nextPageToLast";
    let link_li_fifth = document.createElement("a");
    link_li_fifth.id = "linkNextPageToLast";
    link_li_fifth.className = "page-link buttonPage";
    link_li_fifth.setAttribute("aria-label", "Next");
    link_li_fifth.onclick = function() {
        nextPageToLast()
    };
    let span_li_fifth = document.createElement("span");
    span_li_fifth.setAttribute("aria-hidden", true);
    span_li_fifth.innerHTML = "&gt;&gt;";
    let s2span_li_fifth = document.createElement("span");
    s2span_li_fifth.className = "sr-only";
    s2span_li_fifth.innerHTML = "Next";
    link_li_fifth.appendChild(span_li_fifth);
    link_li_fifth.appendChild(s2span_li_fifth);
    li_fifth.appendChild(link_li_fifth);

    set_modal_buttons();

    container.appendChild(li_first);
    container.appendChild(li_second);
    container.appendChild(li_third);
    container.appendChild(li_fourth);
    container.appendChild(li_fifth);

    $("#inserted_modules_group").empty();
    let modules = document.getElementById('inserted_modules_group');

    var index_v3 = 0;
    for (let index = 1; index < msg_recieved.main_conf.nummodbut + 1; index++) {
        if (index == 1) {
            let pageModule = document.createElement("div");
            pageModule.id = `button_screen_${index}`;
            pageModule.className = "divCardPadding formatTitles buttons_div";
            pageModule.style.display = "none";

            let moduleTitle = document.createElement("div");
            moduleTitle.className = "centered_flex";

            let moduleTextTitle = document.createElement("h6");
            moduleTextTitle.id = "VpeTitleMain";
            moduleTextTitle.innerHTML = `EL732 - <span class="VpeTitleMain">${getString("41")}</span>`;

            let moduleContainerImg = document.createElement("div");
            moduleContainerImg.id = "divCenterImages";

            let moduleImg = document.createElement("img");
            moduleImg.className = "imagesButtons";
            moduleImg.src = "./2puls.png";

            let hrInter = document.createElement("hr");

            let containerModules = document.createElement("div");
            containerModules.className = "container border";

            let containerRowModules = document.createElement("div");
            containerRowModules.className = "row border";

            let containerColS1Modules = document.createElement("div");
            containerColS1Modules.className = "col-4 mt-2 mb-2";

            let buttonLeft = document.createElement("button");
            buttonLeft.setAttribute("data-toggle", "modal");
            buttonLeft.setAttribute("data-target", `modalButtons`);
            buttonLeft.className = "button3D botonesPulsador btn btn-golmar w-100";
            buttonLeft.onclick = function() {
                openmodal("modalButtons", "id_exp_btn0")
            };
            //buttonLeft.setAttribute("onclick", "openmodal('modalButtons')")
            buttonLeft.type = "button";

            let containerColS2Modules = document.createElement("div");
            containerColS2Modules.className = "col-4 mt-2 mb-2";

            let firstArrow = document.createElement("div");
            firstArrow.className = "arrow_box_right";
            firstArrow.id = "arrow_id_exp_btn1";
            let secondArrow = document.createElement("div");
            secondArrow.className = "arrow_box_left";
            secondArrow.id = "arrow_id_exp_btn0";
            console.log(msg_recieved.main_conf);
            console.log("address_btn1" + msg_recieved.main_conf.address_btn1);
            //console.log(msg_recieved.main_conf.address_btn1);
            //console.log(`${msg_recieved.main_conf.mont_btn0.toString().concat("-").concat(msg_recieved.main_conf.address_btn0.toString())}`);
            if (msg_recieved.main_conf.mont_btn0 == 255 && msg_recieved.main_conf.address_btn0 == 65535) {
                secondArrow.innerHTML = `${0}-${132}`;
            } else if (msg_recieved.main_conf.mont_btn0 == 255 || msg_recieved.main_conf.address_btn0 == 65535) {
                if (msg_recieved.main_conf.mont_btn0 == 255) {
                    secondArrow.innerHTML = `${0}-${msg_recieved.main_conf.address_btn0}`;
                } else {
                    secondArrow.innerHTML = `${msg_recieved.main_conf.mont_btn0}-${132}`;
                }

            } else {
                secondArrow.innerHTML = `${msg_recieved.main_conf.mont_btn0}-${msg_recieved.main_conf.address_btn0}`;
            }

            if (msg_recieved.main_conf.mont_btn1 == 255 && msg_recieved.main_conf.address_btn1 == 65535) {
                firstArrow.innerHTML = `${0}-${106}`;
            } else if (msg_recieved.main_conf.mont_btn1 == 255 || msg_recieved.main_conf.address_btn1 == 65535) {
                if (msg_recieved.main_conf.mont_btn1 == 255) {
                    firstArrow.innerHTML = `${0}-${msg_recieved.main_conf.address_btn1}`;
                } else {
                    firstArrow.innerHTML = `${msg_recieved.main_conf.mont_btn1}-${106}`;
                }

            } else {
                firstArrow.innerHTML = `${msg_recieved.main_conf.mont_btn1}-${msg_recieved.main_conf.address_btn1}`;
            }

            containerColS2Modules.appendChild(firstArrow);
            containerColS2Modules.appendChild(secondArrow);

            let containerColS3Modules = document.createElement("div");
            containerColS3Modules.className = "col-4 mt-2 mb-2";

            let buttonRight = document.createElement("button");
            buttonRight.setAttribute("data-toggle", "modal");
            buttonRight.setAttribute("data-target", `modalP2Screen${index}`);
            buttonRight.className = "button3D botonesPulsador btn btn-golmar w-100";
            buttonRight.onclick = function() {
                openmodal("modalButtons", "id_exp_btn1")
            };
            buttonRight.type = "button";


            containerColS1Modules.appendChild(buttonLeft);
            containerColS3Modules.appendChild(buttonRight);

            containerRowModules.appendChild(containerColS1Modules);
            containerRowModules.appendChild(containerColS2Modules);
            containerRowModules.appendChild(containerColS3Modules);

            moduleContainerImg.appendChild(moduleImg);
            moduleTitle.appendChild(moduleTextTitle);

            containerModules.appendChild(containerRowModules);

            pageModule.appendChild(moduleTitle);
            pageModule.appendChild(moduleContainerImg);
            pageModule.appendChild(hrInter);
            pageModule.appendChild(containerModules);

            modules.appendChild(pageModule);

        } else {
            let case_mod = msg_recieved.main_conf[`typemodbut${index}`];
            switch (case_mod) {
                case 3:
                case 6:
                    let pageModulePack = document.createElement("div");
                    pageModulePack.id = `button_screen_${index}`;
                    pageModulePack.className = "divCardPadding formatTitles buttons_div";
                    pageModulePack.style.display = "none";


                    let moduleTitlePack = document.createElement("div");
                    moduleTitlePack.className = "centered_flex";

                    let moduleTextTitlePack = document.createElement("h6");
                    moduleTextTitlePack.innerHTML = `${case_mod == 3 ? "EL703D" : "EL706D"} - <span class="moduleVPE">${getString('76')}</span> ${index-1}`;


                    let moduleContainerImgPack = document.createElement("div");
                    moduleContainerImgPack.id = "divCenterImages";

                    let moduleImgPack = document.createElement("img");
                    moduleImgPack.className = "imagesButtons";


                    let hrInterPack = document.createElement("hr");

                    let containerModulesPack = document.createElement("div");
                    containerModulesPack.className = "container border";


                    //START L1
                    let firstContainerRowModules = document.createElement("div");
                    firstContainerRowModules.className = "row border";

                    let firstContainerColS1Modules = document.createElement("div");
                    firstContainerColS1Modules.className = "col-4 mt-2 mb-2";

                    let firstButtonLeft = document.createElement("button");
                    firstButtonLeft.setAttribute("data-toggle", "modal");
                    firstButtonLeft.setAttribute("data-target", `modalButtons`);
                    if (msg_recieved.main_conf[`typemodbut${index}`] == 3) {
                        moduleImgPack.src = "./3puls.png";
                        firstButtonLeft.className = "btnDisabled button3D botonesPulsador btn btn-golmar w-100";
                    } else {
                        moduleImgPack.src = "./6puls.png";
                        firstButtonLeft.onclick = function() {
                            openmodal("modalButtons", `M${index-2}P2`)
                        };
                        firstButtonLeft.className = "button3D botonesPulsador btn btn-golmar w-100";
                    }
                    firstButtonLeft.type = "button";

                    let firstContainerColS2Modules = document.createElement("div");
                    firstContainerColS2Modules.className = "col-4 mt-2 mb-2  ";

                    let firstArrowL1 = document.createElement("div");
                    firstArrowL1.className = "arrow_box_right arrow_mtdc";
                    firstArrowL1.id = `arrow_M${index-2}P1`;
                    let secondArrowL1 = document.createElement("div");
                    secondArrowL1.className = "arrow_box_left arrow_mtdc";
                    secondArrowL1.id = `arrow_M${index-2}P2`;

                    if (msg_recieved.main_conf[`typemodbut${index}`] == 3) {
                        secondArrowL1.innerHTML = ``;
                        secondArrowL1.className = "arrow_box_left";

                    } else {

                        /* if (msg_recieved.modules[`${index-2}`][`P2`][`montante`] == 255 && msg_recieved.modules[`${index-2}`][`P2`][`direccion`] <= 999) {
                            
                            secondArrowL1.innerHTML = `${0}-${msg_recieved.modules[`${index-2}`][`P2`][`direccion_def`]}`;

                        }else  */
                        
                        if ((msg_recieved.modules[`${index-2}`][`P2`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P2`][`direccion`] >= 1000) ||
                            (msg_recieved.modules[`${index-2}`][`P2`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P2`][`direccion`] <= 999)) {
                                secondArrowL1.innerHTML = `${0}-${msg_recieved.modules[`${index-2}`][`P2`][`direccion_def`]}`;
                        } else if(msg_recieved.modules[`${index-2}`][`P2`][`montante`] <= 254 && msg_recieved.modules[`${index-2}`][`P2`][`direccion`] >= 1000){
                            secondArrowL1.innerHTML = `${msg_recieved.modules[`${index-2}`][`P2`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P2`][`direccion_def`]}`;
                        }else {
                            secondArrowL1.innerHTML = `${msg_recieved.modules[`${index-2}`][`P2`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P2`][`direccion`]}`;
                        }
                    }



                    if ((msg_recieved.modules[`${index-2}`][`P1`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P1`][`direccion`] >= 1000) ||
                        (msg_recieved.modules[`${index-2}`][`P1`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P1`][`direccion`] <= 999)) 
                    {
                        firstArrowL1.innerHTML = `${0}-${msg_recieved.modules[`${index-2}`][`P1`][`direccion_def`]}`;
                    } else if(msg_recieved.modules[`${index-2}`][`P1`][`montante`] <= 254 && msg_recieved.modules[`${index-2}`][`P1`][`direccion`] >= 1000){
                        firstArrowL1.innerHTML = `${msg_recieved.modules[`${index-2}`][`P1`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P1`][`direccion_def`]}`;
                    }else {
                        firstArrowL1.innerHTML = `${msg_recieved.modules[`${index-2}`][`P1`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P1`][`direccion`]}`;
                    }


                    firstContainerColS2Modules.appendChild(firstArrowL1);
                    firstContainerColS2Modules.appendChild(secondArrowL1);

                    let firstContainerColS3Modules = document.createElement("div");
                    firstContainerColS3Modules.className = "col-4 mt-2 mb-2";

                    let firstButtonRight = document.createElement("button");
                    firstButtonRight.setAttribute("data-toggle", "modal");
                    firstButtonRight.setAttribute("data-target", `modalButtons`);
                    firstButtonRight.className = "button3D botonesPulsador btn btn-golmar w-100";
                    firstButtonRight.onclick = function() {
                        openmodal("modalButtons", `M${index-2}P1`)
                    };
                    firstButtonRight.type = "button";

                    firstContainerColS1Modules.appendChild(firstButtonLeft);
                    firstContainerColS3Modules.appendChild(firstButtonRight);

                    firstContainerRowModules.appendChild(firstContainerColS1Modules);
                    firstContainerRowModules.appendChild(firstContainerColS2Modules);
                    firstContainerRowModules.appendChild(firstContainerColS3Modules);
                    //END L1

                    //START L2
                    let secondContainerRowModules = document.createElement("div");
                    secondContainerRowModules.className = "row border";

                    let secondContainerColS1Modules = document.createElement("div");
                    secondContainerColS1Modules.className = "col-4 mt-2 mb-2";

                    let secondButtonLeft = document.createElement("button");
                    secondButtonLeft.setAttribute("data-toggle", "modal");
                    secondButtonLeft.setAttribute("data-target", `modalButtons`);
                    if (msg_recieved.main_conf[`typemodbut${index}`] == 3) {
                        secondButtonLeft.className = "btnDisabled button3D botonesPulsador btn btn-golmar w-100";
                    } else {
                        secondButtonLeft.onclick = function() {
                            openmodal("modalButtons", `M${index-2}P4`)
                        };
                        secondButtonLeft.className = "button3D botonesPulsador btn btn-golmar w-100";
                    }
                    secondButtonLeft.type = "button";

                    let secondContainerColS2Modules = document.createElement("div");
                    secondContainerColS2Modules.className = "col-4 mt-2 mb-2  ";

                    let firstArrowL2 = document.createElement("div");
                    firstArrowL2.className = "arrow_box_right arrow_mtdc";
                    firstArrowL2.id = `arrow_M${index-2}P3`;
                    let secondArrowL2 = document.createElement("div");
                    secondArrowL2.className = "arrow_box_left arrow_mtdc";
                    secondArrowL2.id = `arrow_M${index-2}P4`;

                    if (msg_recieved.main_conf[`typemodbut${index}`] == 3) {
                        secondArrowL2.innerHTML = ``;
                        secondArrowL2.className = "arrow_box_left";
                    } else {

                        if ((msg_recieved.modules[`${index-2}`][`P4`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P4`][`direccion`] >= 1000) ||
                        (msg_recieved.modules[`${index-2}`][`P4`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P4`][`direccion`] <= 999)) 
                        {
                            secondArrowL2.innerHTML = `${0}-${msg_recieved.modules[`${index-2}`][`P4`][`direccion_def`]}`;
                        } else if(msg_recieved.modules[`${index-2}`][`P4`][`montante`] <= 254 && msg_recieved.modules[`${index-2}`][`P4`][`direccion`] >= 1000){
                            secondArrowL2.innerHTML = `${msg_recieved.modules[`${index-2}`][`P4`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P4`][`direccion_def`]}`;
                        }else {
                            secondArrowL2.innerHTML = `${msg_recieved.modules[`${index-2}`][`P4`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P4`][`direccion`]}`;
                        }

                    }

                    if ((msg_recieved.modules[`${index-2}`][`P3`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P3`][`direccion`] >= 1000) ||
                        (msg_recieved.modules[`${index-2}`][`P3`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P3`][`direccion`] <= 999)) 
                    {
                        firstArrowL2.innerHTML = `${0}-${msg_recieved.modules[`${index-2}`][`P3`][`direccion_def`]}`;
                    } else if(msg_recieved.modules[`${index-2}`][`P3`][`montante`] <= 254 && msg_recieved.modules[`${index-2}`][`P3`][`direccion`] >= 1000){
                        firstArrowL2.innerHTML = `${msg_recieved.modules[`${index-2}`][`P3`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P3`][`direccion_def`]}`;
                    }else {
                        firstArrowL2.innerHTML = `${msg_recieved.modules[`${index-2}`][`P3`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P3`][`direccion`]}`;
                    }

                    secondContainerColS2Modules.appendChild(firstArrowL2);
                    secondContainerColS2Modules.appendChild(secondArrowL2);

                    let secondContainerColS3Modules = document.createElement("div");
                    secondContainerColS3Modules.className = "col-4 mt-2 mb-2";

                    let secondButtonRight = document.createElement("button");
                    secondButtonRight.setAttribute("data-toggle", "modal");
                    secondButtonRight.setAttribute("data-target", `modalButtons`);
                    secondButtonRight.className = "button3D botonesPulsador btn btn-golmar w-100";
                    secondButtonRight.onclick = function() {
                        openmodal("modalButtons", `M${index-2}P3`)
                    };
                    secondButtonRight.type = "button";

                    secondContainerColS1Modules.appendChild(secondButtonLeft);
                    secondContainerColS3Modules.appendChild(secondButtonRight);

                    secondContainerRowModules.appendChild(secondContainerColS1Modules);
                    secondContainerRowModules.appendChild(secondContainerColS2Modules);
                    secondContainerRowModules.appendChild(secondContainerColS3Modules);
                    //END L2

                    //START L3
                    let thirdContainerRowModules = document.createElement("div");
                    thirdContainerRowModules.className = "row border";

                    let thirdContainerColS1Modules = document.createElement("div");
                    thirdContainerColS1Modules.className = "col-4 mt-2 mb-2";

                    let thirdButtonLeft = document.createElement("button");
                    thirdButtonLeft.setAttribute("data-toggle", "modal");
                    thirdButtonLeft.setAttribute("data-target", `modalButtons`);
                    if (msg_recieved.main_conf[`typemodbut${index}`] == 3) {
                        thirdButtonLeft.className = "btnDisabled button3D botonesPulsador btn btn-golmar w-100";
                    } else {
                        thirdButtonLeft.onclick = function() {
                            openmodal("modalButtons", `M${index-2}P6`)
                        };
                        thirdButtonLeft.className = "button3D botonesPulsador btn btn-golmar w-100";
                    }
                    thirdButtonLeft.type = "button";

                    let thirdContainerColS2Modules = document.createElement("div");
                    thirdContainerColS2Modules.className = "col-4 mt-2 mb-2  ";

                    let firstArrowL3 = document.createElement("div");
                    firstArrowL3.className = "arrow_box_right arrow_mtdc";
                    firstArrowL3.id = `arrow_M${index-2}P5`;
                    let secondArrowL3 = document.createElement("div");
                    secondArrowL3.className = "arrow_box_left arrow_mtdc";
                    secondArrowL3.id = `arrow_M${index-2}P6`;

                    if (msg_recieved.main_conf[`typemodbut${index}`] == 3) {
                        secondArrowL3.innerHTML = ``;
                        secondArrowL3.className = "arrow_box_left";
                    } else {

                        if ((msg_recieved.modules[`${index-2}`][`P6`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P6`][`direccion`] >= 1000) ||
                        (msg_recieved.modules[`${index-2}`][`P6`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P6`][`direccion`] <= 999)) 
                        {
                            secondArrowL3.innerHTML = `${0}-${msg_recieved.modules[`${index-2}`][`P6`][`direccion_def`]}`;
                        } else if(msg_recieved.modules[`${index-2}`][`P6`][`montante`] <= 254 && msg_recieved.modules[`${index-2}`][`P6`][`direccion`] >= 1000){
                            secondArrowL3.innerHTML = `${msg_recieved.modules[`${index-2}`][`P6`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P6`][`direccion_def`]}`;
                        }else {
                            secondArrowL3.innerHTML = `${msg_recieved.modules[`${index-2}`][`P6`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P6`][`direccion`]}`;
                        }

                    }

                    if ((msg_recieved.modules[`${index-2}`][`P5`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P5`][`direccion`] >= 1000) ||
                        (msg_recieved.modules[`${index-2}`][`P5`][`montante`] >= 255 && msg_recieved.modules[`${index-2}`][`P5`][`direccion`] <= 999)) 
                    {
                        firstArrowL3.innerHTML = `${0}-${msg_recieved.modules[`${index-2}`][`P5`][`direccion_def`]}`;
                    } else if(msg_recieved.modules[`${index-2}`][`P5`][`montante`] <= 254 && msg_recieved.modules[`${index-2}`][`P5`][`direccion`] >= 1000){
                        firstArrowL3.innerHTML = `${msg_recieved.modules[`${index-2}`][`P5`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P5`][`direccion_def`]}`;
                    }else {
                        firstArrowL3.innerHTML = `${msg_recieved.modules[`${index-2}`][`P5`][`montante`]}-${msg_recieved.modules[`${index-2}`][`P5`][`direccion`]}`;
                    }



                    thirdContainerColS2Modules.appendChild(firstArrowL3);
                    thirdContainerColS2Modules.appendChild(secondArrowL3);

                    let thirdContainerColS3Modules = document.createElement("div");
                    thirdContainerColS3Modules.className = "col-4 mt-2 mb-2";

                    let thirdButtonRight = document.createElement("button");
                    thirdButtonRight.setAttribute("data-toggle", "modal");
                    thirdButtonRight.setAttribute("data-target", `modalButtons`);
                    thirdButtonRight.className = "button3D botonesPulsador btn btn-golmar w-100";
                    thirdButtonRight.onclick = function() {
                        openmodal("modalButtons", `M${index-2}P5`)
                    };
                    thirdButtonRight.type = "button";

                    thirdContainerColS1Modules.appendChild(thirdButtonLeft);
                    thirdContainerColS3Modules.appendChild(thirdButtonRight);

                    thirdContainerRowModules.appendChild(thirdContainerColS1Modules);
                    thirdContainerRowModules.appendChild(thirdContainerColS2Modules);
                    thirdContainerRowModules.appendChild(thirdContainerColS3Modules);
                    //END L3

                    moduleContainerImgPack.appendChild(moduleImgPack);
                    moduleTitlePack.appendChild(moduleTextTitlePack);

                    containerModulesPack.appendChild(firstContainerRowModules);
                    containerModulesPack.appendChild(secondContainerRowModules);
                    containerModulesPack.appendChild(thirdContainerRowModules);

                    pageModulePack.appendChild(moduleTitlePack);
                    pageModulePack.appendChild(moduleContainerImgPack);
                    pageModulePack.appendChild(hrInterPack);
                    pageModulePack.appendChild(containerModulesPack);

                    modules.appendChild(pageModulePack);

                    break;

                default:
                    break;
            }
        }
    }

    checkBtns(false);

}

function leerDatos() {
    activar_modal_loading(getString("60"), true, 'leerDatos');
}

function desactivarModalSiempre(modal) {
    modal.modal('hide');

}

function checkTecnology(MainBoard) {
    console.log(msg_recieved.main_conf.technology);
    switch (msg_recieved.main_conf.technology) {
        case 0:
            //msg_recieved.main_conf.technology = 1;
        case 1:
            setPlusFields();
            break;
        case 2:
            console.log("INTO R5");

            setR5Fields();
            break;
    }
}

function SelectTech(value) {

    switch (value) {
        case "1":
            setPlusFields();
            break;
        case "2":
            console.log("INTO R5");

            setR5Fields();
            break;
    }
}

function setPlusFields() {
    //PARTICULARES
    $('#technology').prop("disabled", false);
    $('#plusCommRes').show();
    $('#unoCommRes').show();
    $('#r5CommRes').hide();
    $('#PlusNavButton').show();
    $('#R5NavButton').hide();
    //GENERALES
    $('#backboneContainer').show();
    $('#mainBoardContainer').show();
    $('#generalContainer').show();
    $('#videoSignalContainer').show();
    $('#communicationResistanceContainer').show();
    $('#autoSwitchOnContainer').show();
    $('#withCameraContainer').show();
    $('#cameraLightContainer').show();
    $('#openingTimePlusR5').show();
    $('#localLightsContainer').show();
    //$('#numberOfEnabledButtonsContainer').show();
    $('#callTonesContainer').show();
    $('#toneVolumeContainer').show();
    $('#callToCentralContainer').show();
    $('#sintesisLanguageContainer').show();
    $('#duskSensorContainer').show();
    $('#auxiliaryButtonContainer').show();
    $('#ConfigPulsContainer').show();
    $('#InvertPulsContainer').show();
    $('#InvertColContainer').show();

    $(".hideOnR5").hide();

    $(".direccionModal").attr("placeholder", "1-999");
    $(".direccionModal").attr("max", "999");
    $("#NotRespondingAddr").attr("placeholder", "1-999");

    $('#vocalMessage').change();
}

function setR5Fields() {
    //PARTICULARES
    $('#technology').prop("disabled", false);
    $('#plusCommRes').hide();
    $('#unoCommRes').hide();
    $('#r5CommRes').show();
    $('#PlusNavButton').hide();
    $('#R5NavButton').show();
    //GENERALES
    $('#backboneContainer').hide();
    $('#mainBoardContainer').show();
    $('#generalContainer').hide();
    $('#videoSignalContainer').hide();
    $('#communicationResistanceContainer').show();
    $('#autoSwitchOnContainer').show();
    $('#withCameraContainer').show();
    $('#cameraLightContainer').show();
    $('#openingTimePlusR5').show();
    $('#localLightsContainer').show();
    //$('#numberOfEnabledButtonsContainer').show();
    $('#callTonesContainer').show();
    $('#toneVolumeContainer').show();
    $('#callToCentralContainer').show();
    $('#sintesisLanguageContainer').show();
    $('#duskSensorContainer').show();
    $('#auxiliaryButtonContainer').show();
    $('#ConfigPulsContainer').show();
    $('#InvertPulsContainer').show();
    $('#InvertColContainer').show();

    $(".hideOnR5").show();

    $(".direccionModal").attr("placeholder", "1-250");
    $(".direccionModal").attr("max", "250");
    $("#NotRespondingAddr").attr("placeholder", "1-250");


    $('#vocalMessage').change();

}

function hideDips() {
    $('#PlusNavButton').hide();
    $('#R5NavButton').hide();
}



function restartPage() {
    activar_modal_loading(getString("161"), true, 'restartPage');
}

function setDataToFields() {

    let comRes = 0;

    if (parseInt(msg_recieved.main_conf.communicationsResistance) == 2) {
        comRes = 3;
    } else if (parseInt(msg_recieved.main_conf.communicationsResistance) == 1) {
        if (parseInt(msg_recieved.main_conf.technology) == 0 || parseInt(msg_recieved.main_conf.technology) == 1) { //PLUS
            comRes = 2;
        } else {
            comRes = 1;
        }
    }

    let vocalMessage = msg_recieved.main_conf.activatedSynthesis == 1 ? 2 : msg_recieved.main_conf.callTones;

    $('#technology option[valorsend="' + msg_recieved.main_conf.technology + '"]').prop('selected', true);
    $('#backbone').val(msg_recieved.main_conf.backbone);
    $('#mainBoard option[valorsend="' + msg_recieved.main_conf.mainBoard + '"]').prop('selected', true);
    $('#general option[valorsend="' + msg_recieved.main_conf.general + '"]').prop('selected', true);
    $('#videoSignal option[valorsend="' + msg_recieved.main_conf.videoSignal + '"]').prop('selected', true);
    $('#communicationsResistance option[valorsend="' + comRes + '"]').prop('selected', true);
    $('#autoswitchOn option[valorsend="' + msg_recieved.main_conf.autoswitchOn + '"]').prop('selected', true);
    $('#withCamera option[valorsend="' + msg_recieved.main_conf.withCamera + '"]').prop('selected', true);
    $('#cameraLight option[valorsend="' + msg_recieved.main_conf.cameraLight + '"]').prop('selected', true);
    $('#openingTimePlusR5').val(msg_recieved.main_conf.openingTime);
    $('#localLights option[valorsend="' + msg_recieved.main_conf.numberOfEnabledButtons + '"]').prop('selected', true);
    $('#vocalMessage option[valorsend="' + vocalMessage + '"]').prop('selected', true);
    $('#toneVolume option[valorsend="' + msg_recieved.main_conf.toneVolume + '"]').prop('selected', true);
    $('#callToCentral option[valorsend="' + msg_recieved.main_conf.callToCentral + '"]').prop('selected', true);
    $('#sintesisLanguage option[valorsend="' + msg_recieved.main_conf.sintesisLanguage + '"]').prop('selected', true);
    $('#duskSensor option[valorsend="' + msg_recieved.main_conf.duskSensor + '"]').prop('selected', true);
    $('#auxiliaryButton option[valorsend="' + msg_recieved.main_conf.auxiliaryButton + '"]').prop('selected', true);
    $('#ConfigPuls option[valorsend="' + msg_recieved.main_conf.ConfigPuls + '"]').prop('selected', true);
    $('#NotRespondingAddr').val(msg_recieved.main_conf.NotRespAdrss);
    $('#NotRespondingMont').val(msg_recieved.main_conf.NotRespMont);
    $('#offsetField').val(msg_recieved.main_conf.offset);
    $('#cameraVideoCuadrante option[valorsend="' + msg_recieved.main_conf.cameraOrientation + '"]').prop('selected', true);
    $('#InvertCols').prop('checked', (msg_recieved.main_conf.InvertCol == 1) ? true : false);
    $('#InvertPuls').prop('checked', (msg_recieved.main_conf.InvertPuls == 1) ? true : false);

    $('#vocalMessage').change();
    $('#NotRespondingAddr').change();

}

function lookForGeneral() {
    console.log("lookForGeneral");
    let advancedButtonSettings = $("#ConfigPuls").children("option:selected").attr('valorSend');
    let general = parseInt($("#general").children("option:selected").attr('valorSend'));

    if (msg_recieved.main_conf.technology == 0 || msg_recieved.main_conf.technology == 1) {
        if (general==1) {
            $("#backbone").val(0);
            $("#backbone").attr("disabled", true);
            $("#NotRespondingMont").attr("disabled", false);
            if (advancedButtonSettings == 1) {
                console.log("advancedButtonSettings");
                $('.montanteModal ').attr('disabled', false);
                $("#NotRespondingMont").val(0);

                $("#backbone").change();


                if($("#NotRespondingAddr").attr("disabled") == "disabled"){
                    $("#NotRespondingMont").attr("disabled", true);
                }
            }else{
                $('.montanteModal ').attr('disabled', true);
                $("#backbone").change();

                
                if($("#NotRespondingAddr").attr("disabled") == "disabled"){
                    $("#NotRespondingMont").attr("disabled", true);
                }
            }

        } else {
            $("#backbone").change();
            $("#backbone").attr("disabled", false);
            $('.montanteModal ').attr('disabled', true);
            $("#NotRespondingMont").attr("disabled", true);
            
            

        }
    }
}

function printArrows() {
    let arrow_btn0 = document.getElementById("arrow_id_exp_btn0");
    let arrow_btn1 = document.getElementById("arrow_id_exp_btn1");

    arrow_btn0.innerHTML = `${msg_recieved.main_conf.mont_btn0 == 255 ? '0':msg_recieved.main_conf.mont_btn0}-${msg_recieved.main_conf.address_btn0}`;
    arrow_btn1.innerHTML = `${msg_recieved.main_conf.mont_btn1 == 255 ? '0':msg_recieved.main_conf.mont_btn1}-${msg_recieved.main_conf.address_btn1}`;
    


    let arrow_array = document.getElementsByClassName("arrow_mtdc");

    for (const key in arrow_array) {

        if (arrow_array[key].id != undefined) {
            let id_actual = arrow_array[key].id;
            let push_btn = id_actual.split("P");
            push_btn[0] = push_btn[0].replace('arrow_M', '');
            let montante = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`montante`]);
            let direccion = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`direccion`]);

            if (montante == 255) {
                montante = 0;
            }

            if (direccion == 65535) {
                direccion = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`direccion_def`]);
            }

            arrow_array[key].innerHTML = `${montante == 255 ? '0':montante}-${direccion}`;
            


        }
    }
}



function instanceFunctions() {

    $('#vocalMessage').on('change', function(event) {
        let value = parseInt($(this).children("option:selected").attr('valorSend'));
        console.log(value);
        switch (value) {
            case 0:
                $('#toneVolumeContainer').hide();
                $('#sintesisLanguageContainer').hide();

                $('#alertSynthNotDetected').hide();
                break;
        
            case 1:
                $('#toneVolumeContainer').show();
                $('#sintesisLanguageContainer').hide();

                $('#alertSynthNotDetected').hide();

                break;
            case 2: 
                $('#toneVolumeContainer').show();
                $('#sintesisLanguageContainer').show();

                if (msg_recieved.main_conf.synthesis_presence == 0) {
                    $('#alertSynthNotDetected').show();
                    
                }

                break;
        }
    });
    

    $('#openingTimePlusR5').on('change', function(event) {

        let value = parseInt($(this).val());
        if (value < 0 || value > 99 || isNaN(value)) {
            showAlert(getString("141"));
            $("#openingTimePlusR5").val(3);
            $("#openingTimePlusR5").change();
        } else {
            msg_recieved.main_conf.openingTime = value;
        }
    });

    $('#NotRespondingAddr').on('change', function(event) {
        console.log("NotRespondingAddr");
        
        let value = parseInt($(this).val());
        let tech = parseInt($("#technology").children("option:selected").attr('valorSend'));
        console.log(tech);
        switch (tech) {
            case 1:
                if (value < 1 || value > 999 || isNaN(value)) {

                    if (value == 0) {
                        //$('#NotRespondingAddr').attr("disabled", true);
                        $("#withRedirect").attr('checked', false);
                    }else{
                        showAlert(getString("160"));
                        $("#NotRespondingAddr").val(1);
                        $("#NotRespondingAddr").change();
                        
                    }
                    console.log("WITH REDIRECT");
                } else {
                    msg_recieved.main_conf.NotRespAdrss = value;
                    $("#withRedirect").attr('checked', true);
                }                
                $("#withRedirect").change();
    
                break;
        
            case 2:
                if (value < 1 || value > 250 || isNaN(value)) {
                    if (value == 0) {
                        //$('#NotRespondingAddr').attr("disabled", true);
                        $("#withRedirect").attr('checked', false);
                    }else{
                        showAlert(getString("160"));
                        $("#NotRespondingAddr").val(1);
                        $("#NotRespondingAddr").change();
                    }

                } else {
                    $("#withRedirect").attr('checked', true);
                    msg_recieved.main_conf.NotRespAdrss = value;
                }
                $("#withRedirect").change();

                break;
            }
        });
        
    $('#offsetField').on('change', function(event) {
        let value = parseInt($(this).val());
        if (value < 0 || value > 131 || isNaN(value)) {
            showAlert(getString("154"));
            $("#offsetField").val(0);
            $("#offsetField").change();
        } else {
            msg_recieved.main_conf.offset = value;
        }
    });

    $('#NotRespondingMont').on('change', function(event) {

        let value = parseInt($(this).val());
        if (value < 0 || value > 250 || isNaN(value)) {
            showAlert(getString("158"));
            $("#NotRespondingMont").val(0);
            $("#NotRespondingMont").change();
        } else {
            msg_recieved.main_conf.NotRespMont = value;
        }

    });




    $("#backbone").on('change', function(event) {

        let value = parseInt($(this).val());
        if (value < 0 || value > 250 || isNaN(value)) {
            showAlert(getString("79"));
            $("#backbone").val(0);
            $("#backbone").change();
        } else {
            msg_recieved.main_conf.backbone = value;

            msg_recieved.main_conf.mont_btn0 = value;
            msg_recieved.main_conf.mont_btn1 = value;
            

            for (let module_nm in msg_recieved.modules) {
                for (let push_btn in msg_recieved.modules[module_nm]) {
                    if (msg_recieved.modules[module_nm][push_btn]['direccion_def'] != 0) {
                        msg_recieved.modules[module_nm][push_btn]['montante'] = value;
                    }
                }
            }

            if ($("#NotRespondingAddr").attr("disabled") == "disabled") {
                $("#NotRespondingMont").val(0); 
            }else{
                $("#NotRespondingMont").val(value);
            }
            
            printArrows();
        }
    });

    $('#general').change(function(event) {
        let new_val = parseInt($("#general").children("option:selected").attr('valorSend'));

        alertify.confirm(
            getString("234"),
            getString("176"), //variable
            function() {
                // user clicked "ok"
                lookForGeneral();
            },
            function() {
                $('#general option[valorsend="' + (new_val == 1 ? 0 : 1) + '"]').prop('selected', true);
            }
        )
        .set('labels', {ok: getString("232"), cancel: getString("233")})
        .set('closable', false)
        .set('movable', false);
        
    });

      

    $('#ImportFile').change(function(event) {
        var fr = new FileReader();

        try {
            fr.onload = function() {
                var file = $("#ImportFile").val();
                var fileName = file.split("\\");
                $("#fileNameCfg").val(fileName[fileName.length - 1]);

                try {
                    temp_msg_recieved = JSON.parse(fr.result);
                    $("#sendBtnCFG").prop('disabled', false)
                } catch (error) {
                    temp_msg_recieved = null;
                    $("#sendBtnCFG").prop('disabled', true)

                }
            }

            fr.readAsText(this.files[0]);
        } catch (error) {
            console.log(error);
        }


    });

    $('#modalDivsR5').on('show.bs.modal', function(e) {

        let autoswitchOn = parseInt($("#autoswitchOn").children("option:selected").attr('valorSend'));
        let mainBoard = parseInt($("#mainBoard").children("option:selected").attr('valorSend'));
        let withCamera = parseInt($("#withCamera").children("option:selected").attr('valorSend'));
        let communicationsResistance = parseInt($("#communicationsResistance").children("option:selected").attr('valorSend'));
        let callToCentral = parseInt($("#callToCentral").children("option:selected").attr('valorSend'));
        let toneVolume = parseInt($("#toneVolume").children("option:selected").attr('valorSend'));

        switch (autoswitchOn) {
            case 0:
                $("#1_r5").prop("checked", false);
                break;

            case 1:
                $("#1_r5").prop("checked", true);
                break;
        }

        switch (mainBoard) {
            case 0:
                $("#3_r5").prop("checked", true);
                break;

            case 1:
                $("#3_r5").prop("checked", false);
                break;
        }

        switch (withCamera) {
            case 0:
                $("#4_r5").prop("checked", false);
                break;

            case 1:
                $("#4_r5").prop("checked", true);
                break;
        }

        switch (communicationsResistance) {
            case 0:
                $("#5_r5").prop("checked", false);
                break;

            case 1:
                $("#5_r5").prop("checked", true);
                break;
        }

        switch (callToCentral) {
            case 0:
                $("#6_r5").prop("checked", false);
                break;

            case 1:
                $("#6_r5").prop("checked", true);
                break;
        }

        switch (toneVolume) {
            case 0:
                $("#7_r5").prop("checked", false);
                break;

            case 1:
                $("#7_r5").prop("checked", true);
                break;
        }

    })

    $("#saveDipR5").click(function() {
        var r5_1 = $("#1_r5").is(':checked');
        var r5_2 = $("#2_r5").is(':checked'); //NO FUNCTION
        var r5_3 = $("#3_r5").is(':checked');
        var r5_4 = $("#4_r5").is(':checked');
        var r5_5 = $("#5_r5").is(':checked');
        var r5_6 = $("#6_r5").is(':checked');
        var r5_7 = $("#7_r5").is(':checked');
        var r5_8 = $("#8_r5").is(':checked'); //NO FUNCTION

        //ASSIGN DEFAULT MAIN_SETTINGS

        switch (r5_1) {
            case true:
                $('#autoswitchOn option[valorsend="1"]').prop('selected', true);
                break;

            default:
                $('#autoswitchOn option[valorsend="0"]').prop('selected', true);
                break;
        }

        switch (r5_3) {
            case true:
                $('#mainBoard option[valorsend="0"]').prop('selected', true);
                break;

            default:
                $('#mainBoard option[valorsend="1"]').prop('selected', true);
                break;
        }

        switch (r5_4) {
            case true:
                $('#withCamera option[valorsend="1"]').prop('selected', true);
                break;

            default:
                $('#withCamera option[valorsend="0"]').prop('selected', true);
                break;
        }

        switch (r5_5) {
            case true:
                $('#communicationsResistance option[valorsend="1"]').prop('selected', true);
                break;

            default:
                $('#communicationsResistance option[valorsend="0"]').prop('selected', true);
                break;
        }

        switch (r5_6) {
            case true:
                $('#callToCentral option[valorsend="1"]').prop('selected', true);
                break;

            default:
                $('#callToCentral option[valorsend="0"]').prop('selected', true);
                break;
        }

        switch (r5_7) {
            case true:
                $('#toneVolume option[valorsend="1"]').prop('selected', true);
                break;

            default:
                $('#toneVolume option[valorsend="0"]').prop('selected', true);
                break;
        }

        //setDataToFields();
        structPage(false);
        $("#1_r5").prop("checked", false);
        $("#2_r5").prop("checked", false);
        $("#3_r5").prop("checked", false);
        $("#4_r5").prop("checked", false);
        $("#5_r5").prop("checked", false);
        $("#6_r5").prop("checked", false);
        $("#7_r5").prop("checked", false);
        $("#8_r5").prop("checked", false);
        $("#modalDivsR5").modal('toggle');

    })

    $('#modalDivsPlus').on('show.bs.modal', function(e) {
        let general = parseInt($("#general").children("option:selected").attr('valorSend'));
        let openingTimePlusR5 = parseInt($("#openingTimePlusR5").val());
        let videoSignal = parseInt($("#videoSignal").children("option:selected").attr('valorSend'));
        let withCamera = parseInt($("#withCamera").children("option:selected").attr('valorSend'));
        let communicationsResistance = parseInt($("#communicationsResistance").children("option:selected").attr('valorSend'));
        let toneVolume = parseInt($("#toneVolume").children("option:selected").attr('valorSend'));
        let callToCentral = parseInt($("#callToCentral").children("option:selected").attr('valorSend'));
        let autoswitchOn = parseInt($("#autoswitchOn").children("option:selected").attr('valorSend'));
        let mainBoard = parseInt($("#mainBoard").children("option:selected").attr('valorSend'));
        let code = parseInt($("#backbone").val());
        var str = code.toString(2).padStart(7, '0'); // 10100
        let arr_code = str.split('');
        console.log(openingTimePlusR5 == 3);
        switch (general) {
            case 0:
                $("#1_plus").prop("checked", false);
                break;

            case 1:
                $("#1_plus").prop("checked", true);
                break;
        }


        switch (openingTimePlusR5) {
            case 3:
                $("#2_plus").prop("checked", true);
                break;

            case 15:
                $("#2_plus").prop("checked", false);
                break;
        }

        switch (videoSignal) {
            case 0:
                $("#3_plus").prop("checked", false);
                break;

            case 1:
                $("#3_plus").prop("checked", true);
                break;
        }

        switch (withCamera) {
            case 0:
                $("#4_plus").prop("checked", true);
                break;

            case 1:
                $("#4_plus").prop("checked", false);
                break;
        }


        switch (communicationsResistance) {
            case 0:
                $("#5_plus").prop("checked", false);
                $("#6_plus").prop("checked", false);
                break;
            case 2:
                $("#6_plus").prop("checked", false);
                $("#5_plus").prop("checked", true);
                break;

            case 3:
                $("#6_plus").prop("checked", true);
                $("#5_plus").prop("checked", false);
                break;
        }

        switch (toneVolume) {
            case 0:
                $("#7_plus").prop("checked", false);
                break;

            case 1:
                $("#7_plus").prop("checked", true);
                break;
        }

        switch (callToCentral) {
            case 0:
                $("#8_plus").prop("checked", false);
                break;

            case 1:
                $("#8_plus").prop("checked", true);
                break;
        }

        switch (autoswitchOn) {
            case 0:
                $("#11_plus").prop("checked", false);
                break;

            case 1:
                $("#11_plus").prop("checked", true);
                break;
        }

        switch (mainBoard) {
            case 0:
                $("#13_plus").prop("checked", true);
                break;

            case 1:
                $("#13_plus").prop("checked", false);
                break;
        }

        if (code > 127) {

            $("#14_plus").prop("checked", false);
            $("#15_plus").prop("checked", false);
            $("#16_plus").prop("checked", false);
            $("#17_plus").prop("checked", false);
            $("#18_plus").prop("checked", false);
            $("#19_plus").prop("checked", false);
            $("#20_plus").prop("checked", false);

        } else {

            switch (arr_code[0]) {
                case "0":
                    $("#14_plus").prop("checked", false);
                    break;

                case "1":
                    $("#14_plus").prop("checked", true);
                    break;
            }
            switch (arr_code[1]) {
                case "0":
                    $("#15_plus").prop("checked", false);
                    break;

                case "1":
                    $("#15_plus").prop("checked", true);
                    break;
            }

            switch (arr_code[2]) {
                case "0":
                    $("#16_plus").prop("checked", false);
                    break;

                case "1":
                    $("#16_plus").prop("checked", true);
                    break;
            }

            switch (arr_code[3]) {
                case "0":
                    $("#17_plus").prop("checked", false);
                    break;

                case "1":
                    $("#17_plus").prop("checked", true);
                    break;
            }

            switch (arr_code[4]) {
                case "0":
                    $("#18_plus").prop("checked", false);
                    break;

                case "1":
                    $("#18_plus").prop("checked", true);
                    break;
            }

            switch (arr_code[5]) {
                case "0":
                    $("#19_plus").prop("checked", false);
                    break;

                case "1":
                    $("#19_plus").prop("checked", true);
                    break;
            }

            switch (arr_code[6]) {
                case "0":
                    $("#20_plus").prop("checked", false);
                    break;

                case "1":
                    $("#20_plus").prop("checked", true);
                    break;
            }
        }
    })

    $('#get_version_modal').on('shown.bs.modal', function(e) {
        $("#wroom_v").html(`${msg_recieved.main_conf.version.wifi}.${version}`);
        $("#micro_v").html(msg_recieved.main_conf.version.micro);
        //$("#qv_v").html(msg_recieved.main_conf.version.qv);
    });


    $("#saveDipPlus").click(function() {

        alertify.confirm(
            getString("234"),
            getString("62"), //variable
            function() {
                // user clicked "ok"
                var plus_1 = $("#1_plus").is(':checked');
                var plus_2 = $("#2_plus").is(':checked');
                var plus_3 = $("#3_plus").is(':checked');
                var plus_4 = $("#4_plus").is(':checked');
                var plus_5 = $("#5_plus").is(':checked');
                var plus_6 = $("#6_plus").is(':checked');
                var plus_7 = $("#7_plus").is(':checked');
                var plus_8 = $("#8_plus").is(':checked');
                var plus_9 = $("#9_plus").is(':checked'); //NO  FUNCTION
                var plus_10 = $("#10_plus").is(':checked'); //NO FUNCTION
    
                var plus_11 = $("#11_plus").is(':checked');
                var plus_12 = $("#12_plus").is(':checked'); //NO FUNCTION
                var plus_13 = $("#13_plus").is(':checked');
                var plus_14 = $("#14_plus").is(':checked');
                var plus_15 = $("#15_plus").is(':checked');
                var plus_16 = $("#16_plus").is(':checked');
                var plus_17 = $("#17_plus").is(':checked');
                var plus_18 = $("#18_plus").is(':checked');
                var plus_19 = $("#19_plus").is(':checked');
                var plus_20 = $("#20_plus").is(':checked');
    
                if (plus_5 == true && plus_6 == true) {
                    showAlert(getString("74"))
                } else {
    
                    //ASSIGN DEFAULT MAIN_SETTINGS
    
                    switch (plus_1) {
                        case true:
                            $('#general option[valorsend="1"]').prop('selected', true);
                            break;
    
                        default:
                            $('#general option[valorsend="0"]').prop('selected', true);
                            break;
                    }
    
                    switch (plus_2) {
                        case true:
                            $('#openingTimePlusR5').val('3');
    
                            //$('#openingTimePlusR5 option[valorsend="3"]').prop('selected', true);
                            break;
    
                        default:
                            $('#openingTimePlusR5').val('15');
    
                            //$('#openingTimePlusR5 option[valorsend="15"]').prop('selected', true);
                            break;
                    }
    
                    switch (plus_3) {
                        case true:
                            $('#videoSignal option[valorsend="1"]').prop('selected', true)
                            break;
    
                        default:
                            $('#videoSignal option[valorsend="0"]').prop('selected', true);
                            break;
                    }
    
                    console.log(plus_4);
                    switch (plus_4) {
                        case false:
                            $('#withCamera option[valorsend="1"]').prop('selected', true);
                            break;
    
                        default:
                            $('#withCamera option[valorsend="0"]').prop('selected', true);
                            break;
                    }
    
                    if (plus_5 == false && plus_6 == false) {
                        $('#communicationsResistance option[valorsend="0"]').prop('selected', true);
                    } else if (plus_5 == true) {
                        $('#communicationsResistance option[valorsend="2"]').prop('selected', true);
                    } else if (plus_6 == true) {
                        $('#communicationsResistance option[valorsend="3"]').prop('selected', true);
                    }
    
                    switch (plus_7) {
                        case true:
                            $('#toneVolume option[valorsend="1"]').prop('selected', true);
                            break;
    
                        default:
                            $('#toneVolume option[valorsend="0"]').prop('selected', true);
                            break;
                    }
    
                    switch (plus_8) {
                        case true:
                            $('#callToCentral option[valorsend="1"]').prop('selected', true);
                            break;
    
                        default:
                            $('#callToCentral option[valorsend="0"]').prop('selected', true);
                            break;
                    }
    
    
                    switch (plus_11) {
                        case true:
                            $('#autoswitchOn option[valorsend="1"]').prop('selected', true);
                            break;
    
                        default:
                            $('#autoswitchOn option[valorsend="0"]').prop('selected', true);
                            break;
                    }
    
                    switch (plus_13) {
                        case true:
                            $('#mainBoard option[valorsend="0"]').prop('selected', true);
                            break;
    
                        default:
                            $('#mainBoard option[valorsend="1"]').prop('selected', true);
                            break;
                    }
    
                    var arr_code = new Array();
    
                    arr_code[0] = (plus_14 == true) ? "1" : "0";
                    arr_code[1] = (plus_15 == true) ? "1" : "0";
                    arr_code[2] = (plus_16 == true) ? "1" : "0";
                    arr_code[3] = (plus_17 == true) ? "1" : "0";
                    arr_code[4] = (plus_18 == true) ? "1" : "0";
                    arr_code[5] = (plus_19 == true) ? "1" : "0";
                    arr_code[6] = (plus_20 == true) ? "1" : "0";
    
                    //msg_recieved.main_conf.backbone = parseInt(arr_code.join(''), 2);
                    $("#backbone").val(parseInt(arr_code.join(''), 2));
    
                    //setDataToFields();
                    structPage(false);
                    $("#1_plus").prop("checked", false);
                    $("#2_plus").prop("checked", false);
                    $("#3_plus").prop("checked", false);
                    $("#4_plus").prop("checked", false);
                    $("#5_plus").prop("checked", false);
                    $("#6_plus").prop("checked", false);
                    $("#7_plus").prop("checked", false);
                    $("#8_plus").prop("checked", false);
                    $("#9_plus").prop("checked", false);
                    $("#10_plus").prop("checked", false);
                    $("#11_plus").prop("checked", false);
                    $("#12_plus").prop("checked", false);
                    $("#13_plus").prop("checked", false);
                    $("#14_plus").prop("checked", false);
                    $("#15_plus").prop("checked", false);
                    $("#16_plus").prop("checked", false);
                    $("#17_plus").prop("checked", false);
                    $("#18_plus").prop("checked", false);
                    $("#19_plus").prop("checked", false);
                    $("#20_plus").prop("checked", false);
                    $("#modalDivsPlus").modal('toggle');
                }
            },
            function() {}
        )
        .set('labels', {ok: getString("232"), cancel: getString("233")})
        .set('closable', false)
        .set('movable', false);

    })

    function commResToPlus() {
        $('#communicationsResistance option[valorsend="2"]').prop('selected', true);

    }

    function commResToR5() {
        $('#communicationsResistance option[valorsend="1"]').prop('selected', true);

    }

    $("#mainBoard").change(function() {
        var type = $("#mainBoard").children("option:selected").attr('valorSend');
        checkTecnology(type);
    });

    $("#technology").change(function() {
        //showAlert(getString("63"));
        let new_val = parseInt($("#technology").children("option:selected").attr('valorSend'));

        alertify.confirm(
            getString("234"),
            getString("63"), //variable
            function() {
                var typetech = $("#technology").children("option:selected").attr('valorSend');

                console.log("Tech: " + typetech);
                msg_recieved.main_conf.technology = parseInt(typetech);
                SelectTech(typetech);
                checkBackbone();
                if (parseInt(typetech) == 0 || parseInt(typetech) == 1) {
                    commResToPlus();
                } else {
                    commResToR5();
                }
        
                resetPushButtons();
            },
            function() {
                $('#technology option[valorsend="' + (new_val == 1 ? 0 : 1) + '"]').prop('selected', true);
            }
        )
        .set('labels', {ok: getString("232"), cancel: getString("233")})
        .set('closable', false)
        .set('movable', false);


       

    });

    $('#formFW').submit(function(e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            //url: '192.168.1.254/firmware',
            url: ip_address + '/firmware',
            data: new FormData(this), // important
            contentType: false, // important
            processData: false, // important
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            success: function(data) {
                showAlert(data);
                return false;
            }
        })
    });

    $("#ConfigPuls").change(function(event) {

        let value = parseInt($(this).children("option:selected").attr('valorSend'));

        if (value == 1) {
            checkBtns(false);
        }else{


            alertify.confirm(
                getString("234"),
                getString("175"), //variable
                function() {
                    // user clicked "ok"
                    checkBtns(true);
                },
                function() {
                    $('#ConfigPuls option[valorsend="1"]').prop('selected', true);
                    $('#ConfigPuls').change();
                }
            )
            .set('labels', {ok: getString("232"), cancel: getString("233")})
            .set('closable', false)
            .set('movable', false);
        }
        
    })

    

    $("#factory_values").click(function() {
        alertify.confirm(
            getString("234"),
            getString("64"), //variable
            function() {
                resetPushButtons();
            },
            function() {
            }
        )
        .set('labels', {ok: getString("232"), cancel: getString("233")})
        .set('closable', false)
        .set('movable', false);

    })


    $("#withRedirect").change(function() {
        let value = $(this).is(':checked');
        let general = parseInt($("#general").children("option:selected").attr('valorSend'));
        if (value) {
            $("#alertNotResponding").show();
            $('#NotRespondingAddr').attr('disabled', false);
            if (general == 1) {
                $('#NotRespondingMont').attr('disabled', false);  
                
            }else{
                $('#NotRespondingMont').val($("#backbone").val());
            }
        }else{
            $("#alertNotResponding").hide();
            $('#NotRespondingAddr').val(0);
            $('#NotRespondingAddr').attr('disabled', true);
            //if (general == 1) {
                $('#NotRespondingMont').val(0);
                $('#NotRespondingMont').attr('disabled', true);
            //}
            
        }
        
    });
}

function resetPushButtons() {
    // user clicked "ok"
    let general = parseInt($("#general").children("option:selected").attr('valorSend'));

    msg_recieved.main_conf.address_btn0 = 132;
    msg_recieved.main_conf.address_btn1 = 106;

    msg_recieved.main_conf.mont_btn0 = 0;
    msg_recieved.main_conf.mont_btn1 = 0;

    if (general == 0) {
        msg_recieved.main_conf.mont_btn0 = parseInt($("#backbone").val());
        msg_recieved.main_conf.mont_btn1 = parseInt($("#backbone").val());
    }

    for (let module_nm in msg_recieved.modules) {
        for (let push_btn in msg_recieved.modules[module_nm]) {
            //console.log(msg_recieved.modules[module_nm][push_btn]);
            msg_recieved.modules[module_nm][push_btn]['montante'] = 255;
            msg_recieved.modules[module_nm][push_btn]['direccion'] = 65535;

            if (general == 0) {
                msg_recieved.modules[module_nm][push_btn]['montante'] = parseInt($("#backbone").val());
            }
        }
    }


    let arrow_btn0 = document.getElementById("arrow_id_exp_btn0");
    let arrow_btn1 = document.getElementById("arrow_id_exp_btn1");

    arrow_btn0.innerHTML = `${msg_recieved.main_conf.mont_btn0 == 255 ? '0':msg_recieved.main_conf.mont_btn0}-${msg_recieved.main_conf.address_btn0}`;
    arrow_btn1.innerHTML = `${msg_recieved.main_conf.mont_btn1 == 255 ? '0':msg_recieved.main_conf.mont_btn1}-${msg_recieved.main_conf.address_btn1}`;

    let arrow_array = document.getElementsByClassName("arrow_mtdc");

    for (const key in arrow_array) {
        //console.log(arrow_array[key]);
        if (arrow_array[key].id != undefined) {
            let id_actual = arrow_array[key].id;
            let push_btn = id_actual.split("P");
            push_btn[0] = push_btn[0].replace('arrow_M', '');

            let montante = parseInt($("#backbone").val());

                /*                     if (general == 0) {
                montante = 255;
            } */

            if (general == 1) {
                montante = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`montante`]);
            }

            let direccion = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`direccion_def`]);

            arrow_array[key].innerHTML = `${montante == 255 ? '0':montante}-${direccion}`;
        }

    }

            //$("#backbone").change();

        
}

function getString(number) {

    var input = document.createElement('label');
    input.type = 'hidden';
    input.id = "locale_getter"
    $('body').append(input);
    $('#locale_getter')._t(number)
    let text = $('#locale_getter').html();

    input.remove();

    return text;
}

function loadCfg() {
    if (temp_msg_recieved.hasOwnProperty('type') && temp_msg_recieved.type == TYPE_MODULE) {
        msg_recieved = temp_msg_recieved;
        checkTecnology(msg_recieved.main_conf.mainBoard);
        setDataToFields();
        structPage(true);
    
        console.log("MSG: ");
        console.log(msg_recieved);
    
        showAlert(getString("68"));
    } else {
        showAlert(getString("174"));
    }


    resetFiles_cfg();
}

function checkBtns(resetDefault = false) {
    let btn_sett_adv = parseInt($("#ConfigPuls").children("option:selected").attr('valorSend'));
    let general = parseInt($("#general").children("option:selected").attr('valorSend'));

    if (btn_sett_adv == 1) {
        $(".save_label_mdal").removeClass("hidden");
        $("#offsetField").attr("disabled", true);
        $("#offsetField").val(0);
        switch (msg_recieved.main_conf.technology) {
            case 0:
            case 1:
                console.log(general);
                if (general == 1) {
                    $(".montanteModal").attr("disabled", false)
                    $(".direccionModal").attr("disabled", false)
                }else{
                    $(".montanteModal").attr("disabled", true)
                    $(".direccionModal").attr("disabled", false)
                }
                break;

            case 2:
                $(".backboneContainer").hide();
                $(".direccionModal").attr("disabled", false)
                break;
        }

    } else {
        $("#offsetField").attr("disabled", false);
        switch (msg_recieved.main_conf.technology) {
            case 0:
            case 1:

                $(".montanteModal").attr("disabled", true);
                $(".direccionModal").attr("disabled", true);

                break;

            case 2:
                $(".backboneContainer").hide();
                $(".direccionModal").attr("disabled", true);
                break;
        }

        $(".save_label_mdal").addClass("hidden");


        if (resetDefault) {
            console.log(`Reset defaults: ${resetDefault}`);

            let general = parseInt($("#general").children("option:selected").attr('valorSend'));


            msg_recieved.main_conf.address_btn0 = 132;
            msg_recieved.main_conf.address_btn1 = 106;

            msg_recieved.main_conf.mont_btn0 = 0;
            msg_recieved.main_conf.mont_btn1 = 0;

            if (general == 0) {
                msg_recieved.main_conf.mont_btn0 = parseInt($("#backbone").val());
                msg_recieved.main_conf.mont_btn1 = parseInt($("#backbone").val());
            }

            for (let module_nm in msg_recieved.modules) {
                for (let push_btn in msg_recieved.modules[module_nm]) {
                    //console.log(msg_recieved.modules[module_nm][push_btn]);
                    msg_recieved.modules[module_nm][push_btn]['montante'] = 255;
                    msg_recieved.modules[module_nm][push_btn]['direccion'] = 65535;

                    if (general == 0) {
                        msg_recieved.modules[module_nm][push_btn]['montante'] = parseInt($("#backbone").val());
                    }
                }
            }


            let arrow_btn0 = document.getElementById("arrow_id_exp_btn0");
            let arrow_btn1 = document.getElementById("arrow_id_exp_btn1");

            arrow_btn0.innerHTML = `${msg_recieved.main_conf.mont_btn0 == 255 ? '0':msg_recieved.main_conf.mont_btn0}-${msg_recieved.main_conf.address_btn0}`;
            arrow_btn1.innerHTML = `${msg_recieved.main_conf.mont_btn1 == 255 ? '0':msg_recieved.main_conf.mont_btn1}-${msg_recieved.main_conf.address_btn1}`;

            let arrow_array = document.getElementsByClassName("arrow_mtdc");

            for (const key in arrow_array) {
                //console.log(arrow_array[key]);
                if (arrow_array[key].id != undefined) {
                    let id_actual = arrow_array[key].id;
                    let push_btn = id_actual.split("P");
                    push_btn[0] = push_btn[0].replace('arrow_M', '');

                    let montante = parseInt($("#backbone").val());

/*                     if (general == 0) {
                        montante = 255;
                    } */

                    if (general == 1) {
                        montante = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`montante`]);
                    }

                    let direccion = parseInt(msg_recieved.modules[`${push_btn[0]}`][`P${push_btn[1]}`][`direccion_def`]);

                    arrow_array[key].innerHTML = `${montante == 255 ? '0':montante}-${direccion}`;
                }

            }

        }
    }
}

function resetFiles() {
    $("#fileNameCfg").val("");
    $("#fileNameUP").val("");
    $("#FileToUpdate").val('');
    $("#ImportFile").val('');
    $("#sendBtnFW").prop('disabled', true);
    $("#sendBtnCFG").prop('disabled', true);
}

function resetFiles_cfg() {
    $("#fileNameCfg").val("");
    $("#ImportFile").val('');
    $("#sendBtnCFG").prop('disabled', true);
    $("#sendBtnFW").prop('disabled', true);
    $("#sendBtnCFG").prop('disabled', true);
}

function resetFiles_cfg() {
    $("#fileNameCfg").val("");
    $("#ImportFile").val('');
    $("#sendBtnCFG").prop('disabled', true);
}