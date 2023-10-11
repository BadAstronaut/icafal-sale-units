import { ViewerEvent } from "@speckle/viewer";
import { getStreamCommits, getUserData } from "./speckleUtils.js";
import { get } from "svelte/store";
import { speckleViewer, finishLoading, speckleStream, speckleDatatree, deptosProps, speckleDeptos, catOfInterest, viewerDeptos } from "../../stores/toolStore";
import {
    getPropertiesByTypeParameter,
    filterByCategoryNames
  } from "$lib/speckle/speckleHandler";



export async function buildViewerData() {
    const speckleDT = get(speckleDatatree)
    setSpeckleObjects(speckleDT)
    getViewerObjects()
    //console.log("lotessss",speckleDT)

}
//this function builds the speckle base objects in the scene (lotes and protos)
function setSpeckleObjects(speckleDT){
    const propsToQuery = get(deptosProps)
    const catNames = get(catOfInterest);
    const deptosCat = filterByCategoryNames(speckleDT,catNames)
    //console.log("deptosCat.....",deptosCat)
    speckleDeptos.set(deptosCat)
}

function getViewerObjects(){
    const deptoParams = get(deptosProps)
    const _speckleDeptos = get(speckleDeptos)
    const deptoViewerObjects = extractParamData(_speckleDeptos, deptoParams, "Depto")
    viewerDeptos.set(deptoViewerObjects)
    console.log("viewerDeptosBuilder............",deptoViewerObjects)
}

function extractParamData(speckleObjects, params, type){
    const paramData = []
    speckleObjects.forEach(obj => {
        //clone viewerObj
        const props = obj.parameters
        const _viewerObj = {}
        _viewerObj.id = obj.id
        _viewerObj.category = obj.category
        _viewerObj.tipo = type
        //console.log("====obj",obj)
        if (props) {
        params.forEach(param => {
            //console.log("====prop",prop)
            if(props[param.propId]){
                _viewerObj[param.propName] = props[param.propId].value
            
            }})
        paramData.push(_viewerObj)
        }
    })
    return paramData
}