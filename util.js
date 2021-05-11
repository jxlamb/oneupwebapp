
function getHealthSystemById(data,id){
    return data.filter(
        function(data){return data.id === id}
    )
}

function buildFhirResourcePath(fhirVersion, fhirResourceType, fhirResourceId, operation, queryParams, skip){
    var resourceUrl = `${config.externalServiceUrls.fhirResourceServerBase}${fhirVersion}/${fhirResourceType}`
    if(typeof fhirResourceId !== 'undefined' && fhirResourceId.length > 1){
        resourceUrl += `/${fhirResourceId}`
        if(typeof operation !== 'undefined' && operation.length > 1){
            resourceUrl += `/${operation}`
            if(typeof skip !== 'undefined' && skip > 0 )
                resourceUrl += `?_skip=${skip}`
        }
    } else if(typeof queryParams !== 'undefined'){
        resourceUrl += `${queryParams}`
    }
    return resourceUrl;
}

module.exports = {
    getHealthSystemById,
    buildFhirResourcePath
}