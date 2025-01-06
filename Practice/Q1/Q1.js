/*Make a rectangle and when we move mouse on that rectangle on the left side  of the rectangle ,wee want to gradually change the color of the rectangle to red and while moving mouse on the right side of the rectangle , change the color of the rectangle to blue gradually */

let rect = document.querySelector("#center");

rect.addEventListener("mousemove", function(details){
   let rectLocation = rect.getBoundingClientRect();

    let insideRectVal  = details.clientX - rectLocation.left;
    let center = rectLocation.width/2;

    if(insideRectVal < center ){
        // left sided rect
        let redColor = gsap.utils.mapRange(0,center,255,0,insideRectVal);
        gsap.to(rect, {
            backgroundColor:`rgb(${redColor}, 0, 0)`,
            ease: Power4,
        });
    }else {
        // right sided rect

        let blueColor = gsap.utils.mapRange(center,rectLocation.width,0,255,insideRectVal);
        gsap.to(rect, {
            backgroundColor:`rgb(0, 0, ${blueColor})`,
            ease: Power4,
        });
    }
})

rect.addEventListener("mouseleave",function(){
    gsap.to(rect,{
        backgroundColor: "white",
    });
    rect.computedStyleMap.backgroundColor = "rgb(255,255,255)";
})