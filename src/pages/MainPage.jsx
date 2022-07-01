import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from '../scss/MainPage.module.scss';
import {Button} from 'react-bootstrap';
import { changeProod } from '../store/proodSlice';

export const MainPage = () => {
    const dispatch = useDispatch();
    const {proods} = useSelector((state)=> state.prood)
    const change = (elem)=>{
        dispatch(changeProod(elem))
    }
  return (
    <div className={s.main}>
        <div className={s.main_wrapper}>
            {proods ? proods.map((elem, index)=><div key={elem.id} className={s.template_pizza}>
                <div className={s.template_pizza_wrapper}>
                    <div className={s.prood_id}>#{elem.id}</div>
                    <div className={s.prood_img_wrapper}><div className={s.prood_img} style={{backgroundImage: `url(${elem.img})`}}></div></div>
                    <div className={s.prood_description}><span>{elem.description}</span></div>
                    <div className={s.prood_amount}><div> <Button onClick={()=>change({elem, index, amount: 1})}
                    type='button' variant="outline-primary">+</Button>
                    <span>{elem.amount}</span><Button onClick={()=>change({elem, index, amount: -1})} type='button'
                    variant="outline-primary">-</Button></div></div>
                    <div className={s.prood_price}>{elem.price} ₽</div>
                </div>
            </div>) : <></>}
        </div>
    </div>
  )
}
