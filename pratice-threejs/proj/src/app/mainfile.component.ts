import {Component , OnInit} from '@angular/core'
import * as Three from 'three'
import {OrbitControls} from '@three-ts/orbit-controls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
interface posSave {
    orginalPosition : number[]
}
@Component({
    selector:"MainScreen",
    templateUrl:'html/main00.component.html'

})


export class MainScreen{
    constructor(){}

    ngOnInit(){
        const canvas = document.getElementById('canva-mainSCR') as HTMLCanvasElement
        const ButtonClick = document.getElementById('text-button')
        const camera = new Three.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000)
        const scene =  new Three.Scene()
       
        const renderer = new Three.WebGLRenderer({
            canvas:canvas
        })
        new OrbitControls(camera,renderer.domElement)
        const ligt = new Three.DirectionalLight(0xFFFFFF,1)
        const backLigt = new Three.DirectionalLight(0xFFFFFF,1)
        const world = {
            plane:{

                width:20,
                height:20,
                widthSegments:20,
                heightSegments:20
            }}
        const PlanGemometry = new Three.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.widthSegments)
        const PlaneMat = new Three.MeshPhongMaterial({

            vertexColors:true,
            flatShading:true,
       
            side:Three.DoubleSide
        })
        const PlaneMesh = new Three.Mesh(PlanGemometry,PlaneMat)
        console.log(PlaneMesh)
        const arrayAxises = PlaneMesh.geometry.attributes['position'].array
        const datGui = new dat.GUI()
        console.log(datGui)
        const mouseCord ={
            x:0,
            y:0
        } as Three.Vector2
        const colorPlane = [0,0.19,0.4]
        const randomVals=[]

        for (let i =0 ; i<arrayAxises.length;i++){
            if(i %3 ===0)
            {

                const x = arrayAxises[i]
            const y = arrayAxises[i+1]
            const z = arrayAxises[i+2]

            arrayAxises[i] =(x + Math.random()) -0.5 
            arrayAxises[i+1]=y + Math.random() -0.5
           

             arrayAxises[i+2] =z + Math.random() 
            }
             randomVals.push(Math.random())

        }
       
 

        ligt.position.set(0,0,1)
        backLigt.position.set(0,0,-1)
        scene.add(ligt)
        scene.add(backLigt)
        scene.add(PlaneMesh)
        camera.position.z = 5
        renderer.setSize(innerWidth,innerHeight)
        renderer.setPixelRatio(devicePixelRatio)
       
      

// dat-gui area

        datGui.add(world.plane,'width',1,50).
        onChange(changeManager)

        datGui.add(world.plane,'height',1,50).
        onChange(changeManager) 

        datGui.add(world.plane,'widthSegments',1,50).
        onChange(changeManager)

        datGui.add(world.plane,'heightSegments',1,50).
        onChange(changeManager)



        function changeManager(){


            PlaneMesh.geometry.dispose()
            PlaneMesh.geometry = new Three.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)
            const arrayAxises = PlaneMesh.geometry.attributes['position'].array
            for (let i =0 ; i<arrayAxises.length;i+=3){
                const x = arrayAxises[i]
                const y = arrayAxises[i+1]
                const z = arrayAxises[i+2]
                arrayAxises[i] =(x + Math.random()) -0.5 *2
                arrayAxises[i+1] =y + Math.random() -0.5
    
                 arrayAxises[i+2] =z + Math.random() 
    
            }
            // Color of vertex
            const color:number[] =[]
            const vetexCount = PlaneMesh.geometry.attributes['position'].count
            for (let i=0 ;i<vetexCount; i++)
            {
                
                
           color.push(colorPlane[0],colorPlane[1],colorPlane[2])
                
            }
            const TypedArray =  new Float32Array(color)
            PlaneMesh.geometry.setAttribute('color',new Three.BufferAttribute(TypedArray,3))
            
        }

        
// dat-gui area -- END
const color:number[] =[]
// Color of vertex
const vetexCount = PlaneMesh.geometry.attributes['position'].count
for (let i=0 ;i<vetexCount; i++)
    {

        color.push(colorPlane[0],colorPlane[1],colorPlane[2])

    }
const TypedArray =  new Float32Array(color)
console.log(gsap)
PlaneMesh.geometry.setAttribute('color',new Three.BufferAttribute(TypedArray,3))
let frame =0
function animate(){
    
      requestAnimationFrame(animate);
// mesh movement

//const {array,originalPosition} = PlaneMesh.geometry.attributes['position']
//console.log(PlaneMesh.geometry.attributes['position'])
// Color of vertex -- END   

       renderer.render(scene,camera)
       const raycaster = new Three.Raycaster()
       raycaster.setFromCamera(mouseCord,camera)
       //console.log(PlaneMesh.geometry.attributes['position'].array)
       const originalPosition:posSave={
        orginalPosition:( PlaneMesh.geometry.attributes['position'].array as unknown) as number[]
       }
       frame +=0.01
       const array = PlaneMesh.geometry.attributes['position'].array
       for (let i =0 ;i<array.length;i+=3){
        array[i] = Number(originalPosition.orginalPosition[i]) + Math.cos(frame)*0.01;
      


       }
       PlaneMesh.geometry.attributes['position'].needsUpdate = true



       const collision = raycaster.intersectObject(PlaneMesh)

if(collision.length >0  && collision[0].face && collision[0].face.a !== undefined)
{
    const mesh = collision[0].object as THREE.Mesh;
    //console.log( collision[0]);
   const hold =  mesh.geometry.attributes['color']
    hold.setXYZ(collision[0].face.a,0.1,0.5,1)
    hold.setXYZ(collision[0].face.b,0.1,0.5,1)
    hold.setXYZ(collision[0].face.c,0.1,0.5,1)
    hold.needsUpdate = true
    const hoverColor= {
        r:0.1,
        g:0.5,
        b:1
    }
    gsap.to(hoverColor,{
        r:colorPlane[0],
        
        g:colorPlane[1],
        b:colorPlane[2],
        duration:1,
        onUpdate:()=>{
           if(collision[0].face != null && collision[0].face != undefined){

            hold.setXYZ(collision[0].face.a,hoverColor.r,hoverColor.g,hoverColor.b)
            hold.setXYZ(collision[0].face.b,hoverColor.r,hoverColor.g,hoverColor.b)
            hold.setXYZ(collision[0].face.c,hoverColor.r,hoverColor.g,hoverColor.b)
            hold.needsUpdate = true
           }
        }
    })

}


 addEventListener('mousemove',(event)=>{

         mouseCord.x = (event.clientX / window.innerWidth) * 2 -1 
    
         mouseCord.y = -(event.clientY / window.innerHeight) * 2 +  1 
    
         //console.log(mouseCord)
         })
    

  }
function checkClick(event:MouseEvent){
const url = "https://m-ahsan-ali-profile.netlify.app/"
window.open(url ,'_blank')
}
 ButtonClick?.addEventListener('click',checkClick)

 animate()








    }


}