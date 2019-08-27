function throttle (f, wait){
   let _last = null;
   return function(e){
      let _current = new Date();
      if(_current - _last > wait || !_last){
         f(e);
         _last = _current;
      }
   }
}

module.exports = {
   throttle
}