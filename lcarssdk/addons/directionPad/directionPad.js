LCARS.templates.sdk.directionPad = {
    typeA:{type:'svg',
           class:'addon sdk directionPad typeA',
           xml:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-115 -115 230 230" style="background-color: black"></svg>'
    }
};

LCARS.directionPad = {
    create:function(args){
        if(!args.template){args.template = $.extend(true, {}, LCARS.templates.sdk.directionPad.typeA);}
        if(args.id){args.template.id = args.id;}
        var element = LCARS[args.template.type].create(args.template);
        element = LCARS.definition(element, args);
        return element;
    },
    
    consts: {
        axis_button_half_angle: 8*Math.PI/180,
        inner_pad_radius: 51,
        inner_pad_control_width: 20,
        center_button_width: 16,
        directional_triangle_width: 10,
        directional_triangle_height: 5,
//        directional_triangle_x: LCARS.directionPad.consts.inner_pad_control_width/2 + 25,
        directional_control_separator_width: 2,
        directional_triangle_border_below_x: 1,
        directional_triangle_border_above_x: 1,
        
        rings: [{inner_radius: 55, outer_radius: 77.5},
                {inner_radius: 80, outer_radius: 95},
                {inner_radius: 97.5, outer_radius: 115},
                {inner_radius: 117.5, outer_radius: 1000}],
        ring_button_spacing_angle_deg: 3,
        quadrant_angle_deg: 70,
//        quadrant_start_angle_deg: (90-LCARS.directionPad.consts.quadrant_angle_deg)/2
    },

    defaults: {
        axisButton: {
            ringspan: 1
        },
        ringButton: {
            ringspan: 1,
            buttonspan: 1,
        },
        centerButton: {},
        quadrantButton: {},
        group: {},
        
    }



}

LCARS.dpadButton = {
    create:function(args){
        if(args.version === undefined) {
            args.version = "group";
        }
        var outer_element = null;
        args = $.extend(true, {}, LCARS.directionPad.defaults[args.version], args);

        if(args.href !== undefined) {
            outer_element = document.createElementNS("http://www.w3.org/2000/svg",'a');
        } else {            
            outer_element = document.createElementNS("http://www.w3.org/2000/svg","g");
        }
        outer_element.setAttribute("class", "button");

        switch(args.version) {
        case "axisButton":
            try {
                if((args.ring + args.ringspan) > LCARS.directionPad.consts.rings.length ||
                   args.ring < 0 ||
                   args.ringspan < 0) {
                    throw new RangeError("A ringButton must start with ring>=0, have a ringspan>=0, and end with ring+ringspan <= " + LCARS.directionPad.consts.rings.length + ", but this ringButton starts at ring " + args.ring + " and ends at ring " + (args.ring + args.ringspan) + ".");
                }
                if(args.angle % 90 != 0) {
                    throw new RangeError("The angle for an axisButton must be a multiple of 90 degrees");
                }
                
                var button = document.createElementNS("http://www.w3.org/2000/svg","path");
                var button_angle = args.angle * Math.PI / 180;
                button.setAttribute("class", "dpadButtonBackground");
                button.setAttribute("d", "M " + LCARS.directionPad.consts.rings[args.ring].inner_radius * Math.cos(LCARS.directionPad.consts.axis_button_half_angle + button_angle) + " " + LCARS.directionPad.consts.rings[args.ring].inner_radius * Math.sin(LCARS.directionPad.consts.axis_button_half_angle + button_angle) + "\n" +
                                    "A " + LCARS.directionPad.consts.rings[args.ring].inner_radius + " " + LCARS.directionPad.consts.rings[args.ring].inner_radius + " 0 0 0 " + LCARS.directionPad.consts.rings[args.ring].inner_radius * Math.cos(-LCARS.directionPad.consts.axis_button_half_angle + button_angle) + " " + LCARS.directionPad.consts.rings[args.ring].inner_radius * Math.sin(-LCARS.directionPad.consts.axis_button_half_angle + button_angle) + "\n" +
                                    "L " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius * Math.cos(-LCARS.directionPad.consts.axis_button_half_angle + button_angle) + " " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius * Math.sin(-LCARS.directionPad.consts.axis_button_half_angle + button_angle) + "\n" +
                                    "A " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius + " " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius + " 0 0 1 " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius * Math.cos(LCARS.directionPad.consts.axis_button_half_angle + button_angle) + " " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius * Math.sin(LCARS.directionPad.consts.axis_button_half_angle + button_angle) + "\n" +
                                    "Z");                                  
                button.setAttribute("foo", "bar");
                outer_element.appendChild(button);
                var button_text = document.createElementNS("http://www.w3.org/2000/svg","text");
                button_text.setAttribute("fill", "black");
                button_text.setAttribute("x", Math.cos(button_angle) * (LCARS.directionPad.consts.rings[args.ring].inner_radius + (LCARS.directionPad.consts.rings[Math.min(args.ring + args.ringspan - 1,2)].outer_radius - LCARS.directionPad.consts.rings[args.ring].inner_radius)/2));
                button_text.setAttribute("y", Math.sin(button_angle) * (LCARS.directionPad.consts.rings[args.ring].inner_radius + (LCARS.directionPad.consts.rings[Math.min(args.ring + args.ringspan - 1,2)].outer_radius - LCARS.directionPad.consts.rings[args.ring].inner_radius)/2));
                button_text.setAttribute("dominant-baseline", "middle");
                button_text.setAttribute("text-anchor", "middle");
                //button_text.textContent = args.text;
                outer_element.appendChild(button_text);
            } finally {
            }
            
            
            break;
        case "ringButton":
            try {
                if((args.ring + args.ringspan) > LCARS.directionPad.consts.rings.length ||
                   args.ring < 0 ||
                   args.ringspan < 0 ||
                   args.ring === undefined) {
                    throw new RangeError("A ringButton must start with ring>=0, have a ringspan>=0, and end with ring+ringspan <= " + LCARS.directionPad.consts.rings.length + ", but this ringButton starts at ring " + args.ring + " and ends at ring " + (args.ring + args.ringspan) + ".");
                }

                if(args.index >= args.total ||
                   args.index === undefined ||
                   args.total === undefined) {
                    throw new RangeError("The index of the ringButton (" + args.index + ") must be less than the total number of ringButtons (" + args.total + ").");
                }

                if(args.quadrant < 0 ||
                   args.quadrant > 3 ||
                   args.quadrant === undefined) {
                    throw new RangeError("The quadrant for a ringButton must be 0 <= quadrant <= 3, but the quadrant given was " + args.quadrant + ".");
                }
                
                var button = document.createElementNS("http://www.w3.org/2000/svg","path");
                button.setAttribute("class", "dpadButtonBackground");
                var single_button_angle_deg = (LCARS.directionPad.consts.quadrant_angle_deg - (args.total-1)*LCARS.directionPad.consts.ring_button_spacing_angle_deg)/args.total;
                var quadrant_start_angle_deg = (90-LCARS.directionPad.consts.quadrant_angle_deg)/2;
                var button_angle_deg = single_button_angle_deg*args.buttonspan + LCARS.directionPad.consts.ring_button_spacing_angle_deg*(args.buttonspan-1);
                var button_start_angle_deg = (quadrant_start_angle_deg + args.quadrant*90 + (single_button_angle_deg + LCARS.directionPad.consts.ring_button_spacing_angle_deg)*args.index);
                var button_end_angle_deg = button_start_angle_deg + button_angle_deg;
                var button_start_angle = button_start_angle_deg * Math.PI/180;
                var button_end_angle = button_end_angle_deg * Math.PI/180;
                button.setAttribute("d", "M " + LCARS.directionPad.consts.rings[args.ring].inner_radius * Math.cos(button_start_angle) + " " + LCARS.directionPad.consts.rings[args.ring].inner_radius * Math.sin(button_start_angle) + "\n" +
                                    "A " + LCARS.directionPad.consts.rings[args.ring].inner_radius + " " + LCARS.directionPad.consts.rings[args.ring].inner_radius + " 0 0 1 " + LCARS.directionPad.consts.rings[args.ring].inner_radius * Math.cos(button_end_angle) + " " + LCARS.directionPad.consts.rings[args.ring].inner_radius * Math.sin(button_end_angle) + "\n" +
                                    "L" + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius * Math.cos(button_end_angle) + " " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius * Math.sin(button_end_angle) + "\n" +
                                    "A " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius + " " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius + " 0 0 0 " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius * Math.cos(button_start_angle) + " " + LCARS.directionPad.consts.rings[args.ring + args.ringspan - 1].outer_radius * Math.sin(button_start_angle) + "\n" +
                                    "Z");
                outer_element.appendChild(button);
                var button_text = document.createElementNS("http://www.w3.org/2000/svg","text");
                button_text.setAttribute("x", Math.cos(button_start_angle + (button_end_angle - button_start_angle)/2) * (LCARS.directionPad.consts.rings[args.ring].inner_radius + (LCARS.directionPad.consts.rings[Math.min(args.ring + args.ringspan - 1,2)].outer_radius - LCARS.directionPad.consts.rings[args.ring].inner_radius)/2));
                button_text.setAttribute("y", Math.sin(button_start_angle + (button_end_angle - button_start_angle)/2) * (LCARS.directionPad.consts.rings[args.ring].inner_radius + (LCARS.directionPad.consts.rings[Math.min(args.ring + args.ringspan - 1,2)].outer_radius - LCARS.directionPad.consts.rings[args.ring].inner_radius)/2));
                button_text.setAttribute("dominant-baseline", "middle");
                button_text.setAttribute("text-anchor", "middle");
                outer_element.appendChild(button_text);
                
            } finally {
            }
            break;
            
        case "centerButton":
            var button = document.createElementNS("http://www.w3.org/2000/svg","path");
            button.setAttribute("class", "dpadButtonBackground");
            button.setAttribute("d", "M " + LCARS.directionPad.consts.center_button_width/2 + " " + LCARS.directionPad.consts.center_button_width/2 + " " +
                                "L " + -LCARS.directionPad.consts.center_button_width/2 + " " +  LCARS.directionPad.consts.center_button_width/2 + " " +
                                "L " + -LCARS.directionPad.consts.center_button_width/2 + " " + -LCARS.directionPad.consts.center_button_width/2 + " " +
                                "L " +  LCARS.directionPad.consts.center_button_width/2 + " " + -LCARS.directionPad.consts.center_button_width/2 + " " +
                                "Z");
            outer_element.append(button);

            break;

        case "quadrantButton":
            try {
                if(args.quadrant < 0 || args.quadrant > 3) {
                    throw new RangeError("The quadrant for a ringButton must be 0 <= quadrant <= 3, but the quadrant given was " + args.quadrant + ".");
                }
                var button = document.createElementNS("http://www.w3.org/2000/svg","path");
                button.setAttribute("class", "dpadButtonBackground");
                var inner_pad_corner = Math.sqrt(Math.pow(LCARS.directionPad.consts.inner_pad_radius,2) - Math.pow(LCARS.directionPad.consts.inner_pad_control_width/2,2));
                button.setAttribute("d", "M " + LCARS.directionPad.consts.inner_pad_control_width/2 + " " + LCARS.directionPad.consts.inner_pad_control_width/2 + " " +
                                    "L " + LCARS.directionPad.consts.inner_pad_control_width/2 + " " + inner_pad_corner +
                                    "A " + LCARS.directionPad.consts.inner_pad_radius + " " + LCARS.directionPad.consts.inner_pad_radius + " 0 0 0 " + inner_pad_corner + " " + LCARS.directionPad.consts.inner_pad_control_width/2 + " " +
                                    "Z");
                button.setAttribute("transform", "rotate(" + args.quadrant*90 + ")");
                outer_element.append(button);
            } finally {
            }
            
            break;

        case "directionButton":
            try {
                if(args.angle % 90 != 0) {
                    throw new RangeError("The angle for a directionButton must be a multiple of 90 degrees");
                }
            
                var button = document.createElementNS("http://www.w3.org/2000/svg","path");
                button.setAttribute("class", "dpadButtonBackground");
                button.setAttribute("d", "M " + LCARS.directionPad.consts.inner_pad_control_width/2 + " " + LCARS.directionPad.consts.center_button_width/2 + " " +
                                    "L " + LCARS.directionPad.consts.inner_pad_control_width/2 + " " + -LCARS.directionPad.consts.center_button_width/2 + " " +
                                    "L " + Math.sqrt(LCARS.directionPad.consts.inner_pad_radius*LCARS.directionPad.consts.inner_pad_radius - (LCARS.directionPad.consts.center_button_width/2)*(LCARS.directionPad.consts.center_button_width/2)) + " " + -LCARS.directionPad.consts.center_button_width/2 + " " +
                                    "A " + LCARS.directionPad.consts.inner_pad_radius + " " + LCARS.directionPad.consts.inner_pad_radius + " " + "0 0 1 " + Math.sqrt(LCARS.directionPad.consts.inner_pad_radius*LCARS.directionPad.consts.inner_pad_radius - (LCARS.directionPad.consts.center_button_width/2)*(LCARS.directionPad.consts.center_button_width/2)) + " " + LCARS.directionPad.consts.center_button_width/2 + " " +
                                    "Z");
                outer_element.appendChild(button);
                var directional_triangle = document.createElementNS("http://www.w3.org/2000/svg","polygon");
                directional_triangle.setAttribute("class", "dpadDecoration");
                var directional_triangle_x = LCARS.directionPad.consts.inner_pad_control_width/2 + 25;
                directional_triangle.setAttribute("fill", "black");
                directional_triangle.setAttribute("points", directional_triangle_x + "," + LCARS.directionPad.consts.directional_triangle_width/2 + " " +
                                                  (directional_triangle_x + LCARS.directionPad.consts.directional_triangle_height) + ",0 " +
                                                  directional_triangle_x + "," + -LCARS.directionPad.consts.directional_triangle_width/2);
                outer_element.appendChild(directional_triangle);
                var directional_triangle_border_below = document.createElementNS("http://www.w3.org/2000/svg","polyline");
                directional_triangle_border_below.setAttribute("stroke", "black");
                directional_triangle_border_below.setAttribute("stroke-width", LCARS.directionPad.consts.directional_control_separator_width);
                directional_triangle_border_below.setAttribute("points", (directional_triangle_x - LCARS.directionPad.consts.directional_triangle_border_below_x - LCARS.directionPad.consts.directional_control_separator_width/2)+ "," + -LCARS.directionPad.consts.inner_pad_control_width/2 + " " +
                                                               (directional_triangle_x - LCARS.directionPad.consts.directional_triangle_border_below_x - LCARS.directionPad.consts.directional_control_separator_width/2)+ "," + LCARS.directionPad.consts.inner_pad_control_width/2);
                outer_element.appendChild(directional_triangle_border_below);
                
                var directional_triangle_border_above = document.createElementNS("http://www.w3.org/2000/svg","polyline");
                directional_triangle_border_above.setAttribute("stroke", "black");
                directional_triangle_border_above.setAttribute("stroke-width", LCARS.directionPad.consts.directional_control_separator_width);
                directional_triangle_border_above.setAttribute("points", (directional_triangle_x + LCARS.directionPad.consts.directional_triangle_height + LCARS.directionPad.consts.directional_triangle_border_above_x + LCARS.directionPad.consts.directional_control_separator_width/2)+ "," + -LCARS.directionPad.consts.inner_pad_control_width/2 + " " +
                                                               (directional_triangle_x + LCARS.directionPad.consts.directional_triangle_height + LCARS.directionPad.consts.directional_triangle_border_above_x + LCARS.directionPad.consts.directional_control_separator_width/2)+ "," + LCARS.directionPad.consts.inner_pad_control_width/2);
                outer_element.appendChild(directional_triangle_border_above);
                outer_element.setAttribute("transform", "rotate(" + args.angle + ")");
        } finally {
        }
            break;
            
        case "group":
        default:
            break;
        }

        outer_element = LCARS.definition($(outer_element), args);
        return outer_element;
    },

    settings:{
        label:function(args) {
            if(args.set === true){
                var textElement = $(args.element).find('text');
                if(args.args.label === null && args.original.label != null){     
                    $(textElement).text("");
                }else if(typeof args.args.label === 'string'){
                    $(textElement).text(args.args.label);
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].label){
                    return null;
                } else {
                    return allObjects[args.elemID].label;
                }                
            }  

        },
        color:function(args) {
            if(args.set === true){
                var buttonElement = $(args.element).find('.dpadButtonBackground');
                if(args.args.color === null && args.original.color != null){     
                    $(buttonElement).removeClass(args.original.color); 
                    allObjects[args.elemID].color = null;
                }else if(typeof args.args.color === 'string'){
                    if(args.original.color){$(buttonElement).removeClass(args.original.color);}
                    $(buttonElement).addClass(args.args.color);
                    allObjects[args.elemID].color = args.args.color;
                }            
                return args.element;          
            }else{
                if(!allObjects[args.elemID].color){return null;}else{return allObjects[args.elemID].color;}
            }


        }
    },
};
