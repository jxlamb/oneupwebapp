const sessionPath = '/session';
const newUserPath = '/create-1up-user';
const authCodePath = '/generate-auth-code';
const accessTokenPath = '/exchange-for-access-token';
const connectedHealthSystemPath = '/connected-health-system-id-search';
const fhirResourcePath = '/fetchFhirResources';
const findPatientPath = '/findPatient';
const baseUrl = "http://localhost";
const port = 3000;
const localServiceBase = `${baseUrl}:${port}`;
const authGrantType = "authorization_code";

const localServiceUrls = {
    sessionUrl: `${localServiceBase}${sessionPath}`,
    newUserUrl: `${localServiceBase}${newUserPath}`,
    authCodeUrl: `${localServiceBase}${authCodePath}`,
    accessTokenUrl: `${localServiceBase}${accessTokenPath}`,
    connectedHealthSystemUrl: `${localServiceBase}${connectedHealthSystemPath}`,
    fetchFhirResources: `${localServiceBase}${fhirResourcePath}`,
    findPatient: `${localServiceBase}${findPatientPath}`,
}

const externalServiceUrls = {
    createUserUrl: 'https://api.1up.health/user-management/v1/user',
    authCodeUrl: 'https://api.1up.health/user-management/v1/user/auth-code',
    tokenUrl: 'https://auth.1up.health/oauth2/token',
    healthSystemUrl: 'https://api.1up.health/connect/system/clinical',
    fhirResourceServerBase: 'https://api.1up.health/'
}
const fhirVersions = {
    DSTU2: 'dstu2',
    STU3: 'stu3',
    R4: 'r4',
}
const availableResources = [
    {
        resourceType: 'AllergyIntolerance',
        resourceVersions: [fhirVersions.DSTU2],
    },
    {
        resourceType: 'Condition',
        resourceVersions: [fhirVersions.DSTU2],
    },
    {
        resourceType: 'Coverage',
        resourceVersions: [fhirVersions.STU3],
    },
    {
        resourceType: 'Encounter',
        resourceVersions: [fhirVersions.DSTU2],
    },
    {
        resourceType: 'ExplanationOfBenefit',
        resourceVersions: [fhirVersions.STU3],
    },
    {
        resourceType: 'MedicationOrder',
        resourceVersions: [fhirVersions.DSTU2, fhirVersions.STU3],
    },
    {
        resourceType: 'MedicationDispense',
        resourceVersions: [fhirVersions.STU3],
    },
    {
        resourceType: 'MedicationStatement',
        resourceVersions: [fhirVersions.STU3],
    },
    {
        resourceType: 'Observation',
        resourceVersions: [fhirVersions.DSTU2],
    },
    {
        resourceType: 'Patient',
        resourceVersions: [fhirVersions.DSTU2, fhirVersions.STU3, fhirVersions.R4],
    },
    {
        resourceType: 'ReferralRequest',
        resourceVersions: [fhirVersions.STU3],
    },
]
config = {
    externalServiceUrls: externalServiceUrls,
    localServiceUrls: localServiceUrls,
    baseServiceUrl: `${baseUrl}`,
    servicePort: `${port}`,
    localServiceBasePath: `${localServiceBase}`,
    tokenGrantType: `${authGrantType}`,
    fhirVersions: `${fhirVersions}`,
    availableResources: {availableResources},
}
/*
module.exports = {
    externalServiceUrls: externalServiceUrls,
    localServiceUrls: localServiceUrls,
    baseServiceUrl: `${baseUrl}`,
    servicePort: `${port}`,
    localServiceBasePath: `${localServiceBase}`,
    tokenGrantType: `${authGrantType}`
}
*/