import { ViewerEvent } from "@speckle/viewer";
import { getStreamCommits, getUserData } from "./speckleUtils.js";
import { get } from "svelte/store";
import { speckleViewer, finishLoading, speckleStream, speckleDatatree, deptosProps, speckleDeptos, catOfInterest, viewerDeptos, currentColorSet} from "../../stores/toolStore";
import {
    getPropertiesByTypeParameter,
    filterByCategoryNames,
    processSpeckleSchedule,
    generateRandomColor
} from "$lib/speckle/speckleHandler";



export async function buildViewerData() {
    const speckleDT = get(speckleDatatree)
    setSpeckleObjects(speckleDT)
    getViewerObjects()
    const speckleScheduleObject = processSpeckleSchedule()
    //console.log("speckleSchedule Object-----", speckleScheduleObject);
    speckleScheduleObject.then((scheduleObject) => {
        const scheduleToObject = processScheduleArray(scheduleObject)
        const unifyPropArray = unifyViewerDeptosPropertiesWithSchedule(get(viewerDeptos), scheduleToObject)
        viewerDeptos.set(unifyPropArray)
        colorsByTipology()
        //console.log("speckleSchedule Object-----",unifyPropArray);

    })
    //console.log("lotessss",speckleDT)

}
//this will build objects to color departments based on type 
function colorsByTipology() {
    const _viewerDeptos = get(viewerDeptos);
    const groupedByTipologia = _viewerDeptos.reduce((acc, depto) => {
        if (!acc[depto.tipologia]) {
            acc[depto.tipologia] = [];
        }
        acc[depto.tipologia].push(depto.id);
        return acc;
    }, {});
    //console.log('tipologias........', groupedByTipologia);
    let toColorList = []
    Object.entries(groupedByTipologia).map(([key, value]) => {
        //console.log("each tipologia", tipologia)
        const colorQueryObject = {
            objectIds: value,
            color: generateRandomColor(),
            deptotipologia: key
        };
        toColorList.push(colorQueryObject)
    });
    currentColorSet.set(toColorList)
    return toColorList
}
//schedule data procesing 
function processScheduleArray(arr) {
    //console.log("arr", arr)
    if (!arr.length) {
        throw new Error('Invalid array length');
    }
    const tableData = arr[0];
    const objectProps = arr[1];
    const scheduleData = arr.slice(3) //everything after 2 is schedule data ;

    const schedule = scheduleData.map((row) => {
        const obj = {};
        row.forEach((value, index) => {
            const prop = objectProps[index];
            if (prop == "Área") {
                obj["area"] = value;
            }
            else if (prop == "Número") {
                obj["numero"] = value;
            }
            else if (prop == "Orientación") {
                obj["orientacion"] = value;
            }
            else if (prop == "ICA - Tipo") {
                obj["icatipo"] = value;
            }
            else if (prop == "Comentarios Ventas") {
                obj["tipologia"] = value;
            }
            else if (prop == "Nombre") {
                obj["clasificacion"] = value
            }
            else if (prop == "Edificio") {
                obj["edificio"] = value
            }
            else {
                obj[prop] = value;
            }
        });
        return obj;
    })
    return schedule
}

function unifyViewerDeptosPropertiesWithSchedule(_viewerDeptos, _scheduleToObject) {
    let list1 = _viewerDeptos
    list1.forEach(item1 => {
        const correspondingItem2 = _scheduleToObject.find(item2 =>
            item1.edificio === item2.edificio && item1.numero === item2.numero
        );

        if (correspondingItem2) {
            Object.keys(correspondingItem2).forEach(key => {
                // Only add the property if it doesn't already exist in item1
                if (!item1.hasOwnProperty(key)) {
                    item1[key] = correspondingItem2[key];
                }
            });
        }
    });

    return list1;
}

//this function builds the speckle base objects in the scene (lotes and protos)
function setSpeckleObjects(speckleDT) {
    const propsToQuery = get(deptosProps)
    const catNames = get(catOfInterest);
    const deptosCat = filterByCategoryNames(speckleDT, catNames)
    //console.log("deptosCat.....",deptosCat)
    speckleDeptos.set(deptosCat)
}

function getViewerObjects() {
    const deptoParams = get(deptosProps)
    const _speckleDeptos = get(speckleDeptos)
    const deptoViewerObjects = extractParamData(_speckleDeptos, deptoParams, "Depto")
    viewerDeptos.set(deptoViewerObjects)
    //console.log("viewerDeptosBuilder............", deptoViewerObjects)
}

function extractParamData(speckleObjects, params, type) {
    const paramData = []
    speckleObjects.forEach(obj => {
        //clone viewerObj
        const props = obj.parameters
        const _viewerObj = {}
        _viewerObj.id = obj.id
        _viewerObj.category = obj.category
        _viewerObj.tipoviewer = type
        //console.log("====obj",obj)
        if (props) {
            params.forEach(param => {
                //console.log("====prop",prop)
                if (props[param.propId]) {
                    _viewerObj[param.propName] = props[param.propId].value

                }
            })
            paramData.push(_viewerObj)
        }
    })
    return paramData
}