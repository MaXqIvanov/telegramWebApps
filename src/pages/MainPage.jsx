import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from '../scss/MainPage.module.scss';
import {Button, Modal} from 'react-bootstrap';
import { changeProod } from '../store/proodSlice';

export const MainPage = ({tele}) => {
    const dispatch = useDispatch();
    const {proods} = useSelector((state)=> state.prood)
    const [isModal, setIsModal] = useState(false)
    const change = (elem)=>{
        dispatch(changeProod(elem))
    }
    const onOrder = ()=>{
        setIsModal(!isModal);
        console.log("hew");
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
            <div className={s.btn}><Button onClick={()=>onOrder()} type='button'>заказать</Button></div>
        </div>
        {isModal ? <div className={s.modalOrders}><div className={s.modalOrders_wrapper}>
            <span>Поздравляю! ваш заказ успешно оформлен</span>
            </div> 
                <div onClick={()=>onOrder()} className={`btn-close btn ${s.close}`} closeButton>
                </div>
            </div>
            : <></> }
    </div>
  )
}
