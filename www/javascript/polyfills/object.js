Object.keys = Object.keys || function(o) { 
    var keysArray = []; 
    for(var name in o) { 
        if (o.hasOwnProperty(name)) 
          keysArray.push(name); 
    } 
    return keysArray; 
};
