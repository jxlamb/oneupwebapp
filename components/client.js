window.skip = 0;

function showOutput(containerId, isSuccess, localOperation, json, externalOperation, maxLevels){
    var jsonViewer = new JSONViewer();
    var container = document.querySelector(containerId);
    var html = '</br><p className="lead"><strong>Internal Service Path</strong></p><p><kbd>' + localOperation + '</kbd></p>';
    html += '</br><p className="lead"><strong>External Service Path</strong></p><p><kbd>' + externalOperation + '</kbd></p>';
    if(isSuccess === true){
        html+= '<div class="alert alert-success" role="alert">Result of Rest Call: <strong>Success</strong></div><p className="lead">JSON</p>';
    } else {
        html+= '<div class="alert alert-danger" role="alert">Result of Rest Call: <strong>Error</strong></div><p className="lead">Error Details</p>';
    }
    container.innerHTML = html;
    container.appendChild(jsonViewer.getContainer());
    if(typeof maxLevels === 'undefined') {
        maxLevels = -1;
    }
    jsonViewer.showJSON(json,maxLevels,maxLevels);
}

function userAuthCodePayload(data, path, extPath){
    if(data.success === true) {
        showOutput('#stepTwoSuccess',true, 'POST ' + path, data, 'POST ' + extPath, );
        $('#authCode').val(data.code);

    } else{
        showOutput('#stepTwoError',false,'POST ' + path, data, 'POST ' + extPath, );
    }
}

function accessTokenPayload(data){
    let localOp = 'POST ' + localServiceUrls.accessTokenUrl;
    if(typeof data.access_token !== 'undefined') {
        showOutput('#stepThreeSuccess', true, localOp, data, 'POST ' + externalServiceUrls.tokenUrl);
        $('#accessToken').val(data.access_token);
        $('#refreshToken').val(data.refresh_token);
        $('#accessTokenScope').val(data.scope);
        $('#tokenPayloadAlert').fadeIn();
    } else{
        showOutput('#stepThreeError',false, localOp, data, 'POST ' + externalServiceUrls.tokenUrl);
        $('#tokenPayloadAlert').style.visibility = "display: none;"
    }
}

function healthSystemPayload(data){
    let localOp = 'POST ' + localServiceUrls.connectedHealthSystemUrl;
    let extOp = 'GET ' + externalServiceUrls.healthSystemUrl;
    if(typeof data.id !== 'undefined') {
        showOutput('#stepFourSuccess',true, localOp, data, extOp);
        $('#connectionStatusAlertUnknown').fadeOut();
        $('#healthSystemName').val(data.name);
        $('#healthSystemFhirUrl').val(data.resource_url);
        $('#healthSystemFhirVersion').val(data.api_version);

        var apiVersionString = data.api_version.toLowerCase();
        if(apiVersionString.search(fhirVersions.DSTU2.toLowerCase())) {
            $('#fhirVersionPath').val(fhirVersions.DSTU2);
        } else if(apiVersionString.search(fhirVersions.STU3.toLowerCase()))  {
            $('#fhirVersionPath').val(fhirVersions.STU3);
        } else {
            $('#fhirVersionPath').val(fhirVersions.R4);
        }
        var authUrl = externalServiceUrls.healthSystemUrl;
        authUrl+='/'+$('#healthSystemId').val();
        authUrl+='?client_id=' + $('#client_id').val();
        authUrl+= '&access_token=' + $('#accessToken').val();

        $('#loginEhrTestUser').attr('href', authUrl);
        if(data.status == "connection_working"){
            $('#connectionStatusAlertSuccess').fadeIn();
            $('#connectionStatusAlertFailure').fadeOut();
        } else {
            $('#connectionStatusAlertSuccess').fadeOut();
            $('#connectionStatusAlertFailure').fadeIn();
        }
    } else{
        $('#connectionStatusAlertUnknown').fadeIn();
        $('#connectionStatusAlertSuccess').fadeOut();
        $('#connectionStatusAlertFailure').fadeOut();
        showOutput('#stepFourError', false, localOp, data, extOp);
    }
}

function fetchFhirResources(data){
    let localOp = 'POST ' + localServiceUrls.fetchFhirResources;
    let externalOp = 'GET ' + externalServiceUrls.fhirResourceServerBase + `FhirVersion/ResourceType[query][/ResourceId[Operation]]`;
    if(typeof data.total !== 'undefined' & data.total > 0) {
        showOutput('#stepSevenSuccess', true, localOp, data, externalOp)
    } else{
        showOutput('#stepSevenFailure',false, localOp, data, externalOp)
    }
}

function getPatientResource(data){
    let localOp = 'POST ' + localServiceUrls.findPatient;
    let externalOp = 'GET ' + externalServiceUrls.fhirResourceServerBase + `[FhirVersion]/Patient`;
    if(typeof data.id !== 'undefined') {
        showOutput('#stepSixSuccess', true, localOp, data, externalOp)
        $('#fhirResourceId').val(data.id)
    } else{
        showOutput('#stepSixFailure',false, localOp, data, externalOp)
    }
}

$(document).ready(function(){
    $.get(localServiceUrls.sessionUrl, function(data){
        if(typeof data !== 'undefined'){
            if(typeof data.authCodePayload !== 'undefined'){
                userAuthCodePayload(data.authCodePayload, 'POST '+ localServiceUrls.authCodeUrl, 'POST ' + externalServiceUrls.authCodeUrl);
            }
            if(typeof data.accessTokenPayload !== 'undefined'){
                accessTokenPayload(data.accessTokenPayload);
            }
            if(typeof data.healthSystemPayload !== 'undefined'){
                healthSystemPayload(data.healthSystemPayload);
            }
            if(typeof data.patientResource !== 'undefined'){
                getPatientResource(data.patientResource);
            }
        }
    });

    $('#create').click(function(){
        $.post(localServiceUrls.newUserUrl,
            {
                client_id: $('#client_id').val(),
                client_secret: $('#client_secret').val(),
                app_user_id: $('#app_user_id').val()
            }, function (data) {
                userAuthCodePayload(data, localServiceUrls.newUserUrl, externalServiceUrls.createUserUrl);
            });
    });

    $('#useexisting').click(function(){
        $.post(localServiceUrls.authCodeUrl,
            {
                client_id: $('#client_id').val(),
                client_secret: $('#client_secret').val(),
                app_user_id: $('#app_user_id').val()
            }, function (data) {
                userAuthCodePayload(data, localServiceUrls.authCodeUrl, externalServiceUrls.authCodeUrl);
            });
    });

    $('#exchange').click(function(){
        $.post(localServiceUrls.accessTokenUrl,
            {
                client_id: $('#client_id').val(),
                client_secret: $('#client_secret').val(),
                code: $('#authCode').val()
            }, function (data) {
                accessTokenPayload(data);
            });
    });

    $('#testHealthSystem').click(function(){
        $.post(localServiceUrls.connectedHealthSystemUrl,
            {
                client_id: $('#client_id').val(),
                client_secret: $('#client_secret').val(),
                id: parseInt($('#healthSystemId').val())
            }, function (data) {
                healthSystemPayload(data);
            });
    });

    $('#getPatient').click(function(){
        window.skip = 0
        $.post(localServiceUrls.findPatient,
            {
                accessToken: $('#accessToken').val(),
                fhirVersionPath: $('#fhirVersionPath').val(),
                fhirResourceType: 'Patient'
            }, function (data) {
                getPatientResource(data);
            });
    });

    $('#runFhirQuery').click(function(){
        window.skip = 0
        $.post(localServiceUrls.fetchFhirResources,
            {
                accessToken: $('#accessToken').val(),
                fhirVersionPath: $('#fhirVersionPath').val(),
                fhirResourceType: $('#fhirResourceType').val(),
                fhirResourceId: $('#fhirResourceId').val(),
                fhirQueryString: $('#fhirQueryString').val(),
                fhirOperation: $('#fhirOperation').val(),
                skip: window.skip
            }, function (data) {
                fetchFhirResources(data);
            });
    });

    $('#previous').click(function(){
        if(window.skip <= 10){
            window.skip = 0
        } else {
            window.skip -= 10
        }
        $.post(localServiceUrls.fetchFhirResources,
            {
                accessToken: $('#accessToken').val(),
                fhirVersionPath: $('#fhirVersionPath').val(),
                fhirResourceType: $('#fhirResourceType').val(),
                fhirResourceId: $('#fhirResourceId').val(),
                fhirQueryString: $('#fhirQueryString').val(),
                fhirOperation: $('#fhirOperation').val(),
                skip: window.skip
            }, function (data) {
                fetchFhirResources(data);
            });
    });

    $('#next').click(function(){
        window.skip = window.skip + 10;
        $.post(localServiceUrls.fetchFhirResources,
            {
                accessToken: $('#accessToken').val(),
                fhirVersionPath: $('#fhirVersionPath').val(),
                fhirResourceType: $('#fhirResourceType').val(),
                fhirResourceId: $('#fhirResourceId').val(),
                fhirQueryString: $('#fhirQueryString').val(),
                fhirOperation: $('#fhirOperation').val(),
                skip: window.skip
            }, function (data) {
                fetchFhirResources(data);
            });
    });
});