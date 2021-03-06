import React, { Component } from 'react';
import axios from 'axios';

import API_PATH from './routes';

const ENUM_MODULE_NAMES = {
    all: 'all',
    age: 'age',
    emotion: 'emotion',
    face: 'face',
    face_add: 'face_add',
    gender: 'gender'
};

const ENUM_CONVERT_MODULE_NAMES = {
    action_recognition: 'null',
    age_prediction: ENUM_MODULE_NAMES.age,
    emotion_recognition: ENUM_MODULE_NAMES.emotion,
    face_recognition: ENUM_MODULE_NAMES.face,
    gender_prediction: ENUM_MODULE_NAMES.gender
};

const ENUM_MODULE_STATUS = {
    all: 'allStatus',
    age: 'ageStatus',
    emotion: 'emotionStatus',
    face: 'faceStatus',
    face_add: 'faceAddStatus',
    gender: 'genderStatus'
};

let makeFormData = (imageUri) => {
    file = {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpg"
    };

    const body = new FormData();
    body.append('file', file);
    
    return body;
};

let getModuleStatusForType = (type) => {
    if (type === ENUM_MODULE_NAMES.age){
        return ENUM_MODULE_STATUS.age;
    } else if (type === ENUM_MODULE_NAMES.all){
        return ENUM_MODULE_STATUS.all;
    } else if (type === ENUM_MODULE_NAMES.emotion){
        return ENUM_MODULE_STATUS.emotion;
    } else if (type === ENUM_MODULE_NAMES.face){
        return ENUM_MODULE_STATUS.face;
    } else if (type === ENUM_MODULE_NAMES.face_add){
        return ENUM_MODULE_STATUS.face_add;
    } else if (type === ENUM_MODULE_NAMES.gender){
        return ENUM_MODULE_STATUS.gender;
    }
    return null;
};

getModuleApiPathForType = (type) => {
    if (type === ENUM_MODULE_NAMES.ping){
        return API_PATH.PING;
    } else if (type === ENUM_MODULE_NAMES.all){
        return API_PATH.ALL;
    } else if (type === ENUM_MODULE_NAMES.age){
        return API_PATH.AGE;
    } else if (type === ENUM_MODULE_NAMES.emotion){
        return API_PATH.EMOTION;
    } else if (type === ENUM_MODULE_NAMES.face){
        return API_PATH.FACE;
    } else if (type === ENUM_MODULE_NAMES.face_add){
        return API_PATH.FACE_ADD;
    } else if (type === ENUM_MODULE_NAMES.gender){
        return API_PATH.GENDER;
    }
    return null;
};

const RequestPing = (ip, sendPingResult) => {
    URL = "http://" + ip + ":5000" + this.getModuleApiPathForType(ENUM_MODULE_NAMES.ping);

    axios.get(URL)
        .then(function (response) {
            //console.log('[RequestPing::RESPONSE]: Result: ', response);
            if (response.data.result == 'pong'){
                sendPingResult(true);
            }
            else{
                sendPingResult(false);
            }
        })
        .catch(function (error) {
            //console.log('[RequestPing::RESPONSE]: Result: ', error);
        })
        .then(function () {
            //console.log('[RequestPing::RESPONSE]: Result: END');
        });
};

const RequestModule = (moduleType, ip, imageUri, setModuleAvailable, sendResults) => {
    URL = "http://" + ip + ":5000" + this.getModuleApiPathForType(moduleType);

    if (URL === null) {
        return;
    }

    formData = makeFormData(imageUri);

    axios.post(URL, formData)
        .then(function (response) {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: ', response);
            if (response.data.success == true){
                sendResults(moduleType, response.data.faces[0].result, response.data.faces[0].confidence, response.data.process.total);
            }
            else{
                sendResults(moduleType, "Face Lost", "-1", '-1');
            }
        })
        .catch(function (error) {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: ', error);
        })
        .then(function () {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: END');
            setModuleAvailable(getModuleStatusForType(moduleType));
        });
};





const RequestFaceAdd = (moduleType, ip, imageUri, setModuleAvailable, sendResults, params, name) => {
    if (params !== '') {
        params = '?id=' + params;
    }
    if (name !== '') {
        if (params === ''){
            name = '?name=' + name;
        }
        else {
            name = '&name=' + name;
        }
        sendResults('isFaceAddReachedLimit', false);
        sendResults('name', '');
    }
    
    URL = "http://"+ ip +":5000" + this.getModuleApiPathForType(moduleType) + params + name;
    console.log('urlllllllllllllllllllllllllllllllllllll', URL);


    if (URL === null) {
        return;
    }

    formData = makeFormData(imageUri);

    axios.post(URL, formData)
        .then(function (response) {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: ', response);
            
            if (response.data.id >= 0) {
                sendResults('faceAddId', response.data.id);
                sendResults('isFaceAddReachedLimit', response.data.limit);
            }
        })
        .catch(function (error) {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: ', error);
        })
        .then(function () {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: END');
            setModuleAvailable(getModuleStatusForType(moduleType));
        });
};


const RequestFaceTrain = () => {
    
    axios.get('/user?ID=12345')
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

} 



const RequestAll = (moduleType, ip, imageUri, setModuleAvailable, sendResults, params, now, setTotalMS) => {
    URL = "http://" + ip + ":5000" + this.getModuleApiPathForType(moduleType) + params;

    if (URL === null) {
        return;
    }

    formData = makeFormData(imageUri);

    axios.post(URL, formData)
        .then(function (response) {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: ', response);

            for (var i = 0; i < response.data.modules.length; i++) {
                
                module = response.data.modules[i];

                if (module.success == true){
                    sendResults(ENUM_CONVERT_MODULE_NAMES[module.module], module.faces[0].result, module.faces[0].confidence, response.data.process.total);
                }
                else{
                    sendResults(ENUM_CONVERT_MODULE_NAMES[module.module], "Face Lost", "-1", '-1');                 
                }
            }
        })
        .catch(function (error) {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: ', error);
        })
        .then(function () {
            console.log('[RequestModule::RESPONSE]: Type: ', moduleType, 'Result: END');
            setModuleAvailable(getModuleStatusForType(moduleType));
            end = new Date();
            ms = end - now;
            setTotalMS(ms);
        });
};




const PostImage = (imageUri) => {
    baseURL = 'http://10.0.2.2:5000/api/v1/demo';
    //baseURL = 'http://192.168.43.143:5000/api/v1/demo';

    formData = makeFormData(imageUri);

    axios.post(baseURL, formData)
        .then(function (response) {
            console.log('[PostImage]:: SUCCESS: ', response);
        })
        .catch(function (error) {
            console.log('[PostImage]:: FAILED: ', error);
        })
        .then(function () {
            console.log('<-------------------------->');
        });
};

export default ENUM_MODULE_NAMES;
export { RequestModule, RequestPing, PostImage, RequestFaceAdd, RequestAll }
