import { readable, writable } from 'svelte/store';


export const speckleViewer = writable({
    speckleViewer: null

})
export const speckleSchedule = writable("98679a5a71")

export const activeIoTIndicators = writable([])

export const finishLoading = writable(false);

export const speckleStream = writable('xxxx')

export const speckleDatatree = writable(null);

export const draggables = writable([
    { id:'Sensor', name: 'Temperatura', active:false},
    { id:'SensorHum', name: 'Humedad', active:false},
    { id:'PDF', name: 'PDF', active:false },
    // other items can go here
])

export const currentSelection = writable(null)

export const daluxSafetyDataActiveProject = writable(null)

export const selectionPropertiesOfInterest = readable([
    { 
        name: 'family', 
        value:true
    },
    { 
        name: 'units', 
        value:true
    },
])

//numero deopto > 'ALL_MODEL_INSTANCE_COMMENTS' y torre > 'ALL_MODEL_DESCRIPTION'
export const deptosProps = writable([{propId:"ALL_MODEL_INSTANCE_COMMENTS", propName:"numero"}, {propId:"ALL_MODEL_DESCRIPTION", propName:"edificio"}])   

export const catOfInterest = readable(["Mass", "Masa"])

export const speckleDeptos = writable([])

export const viewerDeptos = writable([])

export const currentColorSet = writable([])

export const currentDepto = writable(null)

export const currentViewerDepto = writable(null)

export const sidebar_show = writable(false)

export const displayCompositionTable_show = writable(false)

export const displayOrientationAnalytics_show = writable(false)

export const showModal = writable(false)

export const colorValueDisponibility = writable({
    Disponible: 0x6fc066,
    Ocupado: 0xc0666f,
    Reservado: 0x666fc0,
})

//this variable will hold the service selected array from the filter 
export const disponibilitySelected = writable("Disponible")

export const chatMessages = writable([])