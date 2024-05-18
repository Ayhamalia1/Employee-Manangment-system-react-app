import React from 'react';
import style from '../Loader/Style.module.css';

function Loader() {
  return (
<>
<div className={style["spinner"]}>
  <div className={style["bounce1"]} />
  <div className={style["bounce2"]} />
  <div className={style["bounce3"]} />
</div>

</>
    
  )
}

export default Loader