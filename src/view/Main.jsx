import api from "../plugins/axios/api";
import Avatar from "antd/es/avatar/avatar";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import { useSearchParams } from "react-router-dom";
import {
    Alert,
    Button,
    Spin,
    Form,
    Input,
    Rate,
    Result,
    Select,
    Switch,
    Tooltip,
    message
} from "antd";
import "antd/dist/antd.css";
import '../scss/Main.scss';
import Modal from "antd/es/modal/Modal";
import Error from "../components/FailedPage/Error";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {getMastersShedule} from '../store/mainSlice';
import image from '../media/image_not_found.svg'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from "date-fns/locale/ru";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import InputMask from 'react-input-mask';

const { TextArea } = Input;

function Main() {
    const [value, onChange] = useState(new Date());
    //const {user} = useSelector((state)=> state.main) 
    const [telegramChatId, setTelegramChatId] = useState()  
    const dispatch = useDispatch(); 
    const {shedulesMaster} = useSelector(state => state.main)
    //dispatch(addUser(params))
    const [searchParams, setSearchParams] = useSearchParams();
    const { Option } = Select;
    const { TextArea } = Input;
    const params = useParams();
    let [userData, setUserData] = useState([])
    let [servicesData, setServicesData] = useState([])
    let [feedbackData, setFeedbackData] = useState([])
    let [feedbackV, setFeedbackV] = useState(false)
    let [modalV, setModalV] = useState(false)
    let [successModalV, setSuccessModalV] = useState(false)
    let [errorModal, setErrorModal] = useState(false)
    let [selectedService, setSelectedService] = useState('')
    let [commentHolder, setCommentHolder] = useState(null)
    let [nameHolder, setNameHolder] = useState('')
    let [phoneHolder, setPhoneHolder] = useState('')
    let [selectedDate, setSelectedDate] = useState(null)
    let [selectedTime, setSelectedTime] = useState(null)
    let [timeData, setTimeData] = useState([])
    let [notWorking, setNotWorking] = useState(false)
    let [notSetService, setNotSetService] = useState(false);
    let [notSetComment, setNotSetComment] = useState(false);
    let [recordCheck, setRecordCheck] = useState(true)
    let [nameFeedHolder,setNameFeedHolder] = useState(null)
    let [phoneFeedHolder,setPhoneFeedHolder] = useState(null)
    let [gradeFeedHolder,setGradeFeedHolder] = useState(null)
    let [commentFeedHolder,setCommentFeedHolder] = useState('')
    let [checkFeedHolder,setCheckFeedHolder] = useState(true)
    let [successFeedModalV, setSuccessFeedModalV] = useState(false)
    let [yHolder,setYHolder] = useState(moment().year())
    let [mHolder,setMHolder] = useState('')
    let [dHolder,setDHolder] = useState('')
    let [isLoading,setIsLoading] = useState(false)

    const [loadDate, setIsLoadDate] = useState(null)
    const [sendData, setSendData] = useState(false);
    const [errors, setErrors] = useState('');
    // this is day array

    const [arrayHolder, setArrayHolder] = useState([
        moment().year(),
        moment().year() + 1
    ])
    const [arrayMHolder, setArrayMHolder] = useState([])
    // end this is array  

    const checkImagePromise = ( url ) => new Promise( (resolve, reject ) => {
        let img = new Image();
            img.addEventListener('load', resolve );
            img.addEventListener('error', reject );
            img.src = url;
    });

    const loadData = async ()=>{
        setIsLoading(true)
        let tg = window.Telegram.WebApp;
        let user = {...tg.initData};
        let user_id = tg.initDataUnsafe.user?.id
        let chat_id;
        console.log(tg);
        try {
            await api(`chat/telegram_chat/?user_id=${user_id}`).then((response)=>{ 
            let user_info = response.data
            chat_id = user_info[0].chat_telegram_id 
            setTelegramChatId(chat_id)
            
            dispatch(getMastersShedule({
                id: chat_id,
                year: moment().year(),
                monthe: moment().month() + 1
            }))
             }).then(async ()=>{
                await api(`portfolio/user_landing/master/?telegram_id=${chat_id}`)
                .then((response)=>{
                    setUserData(response.data[0])
                    setIsLoading(false)
                })
                .catch((e)=>{
                    if (e.response.status === 500 || e.response.status === 403){
                        setErrorModal(true)
                    }
                })
                await api(`portfolio/user_landing/services/?telegram_id=${chat_id}`)
                    .then((response)=>{
                        setServicesData(response.data)
                        let images = document.querySelectorAll('img');
                        images.forEach( img => {
                            checkImagePromise( img.src )
                                .then( res => {
                                    // С картинкой все ок - ничего не делаем
                                })
                                .catch( error => {
                                    // С картинкой ошибка - ставим заглушку
                                    img.src = image;
                                });
                        });
                    })
                await api(`portfolio/user_landing/grades/?telegram_id=${chat_id}`)
                    .then((response)=>{
                        setFeedbackData(response.data)
                    })

                    setMHolder(moment().month() + 1)
             })
           
        } catch (error) {
            
        }
        setIsLoading(false)
    }

    // вернуть эту строчку в процессе
    useEffect(()=>{
       loadData()
    },[])
    useEffect(()=>{
        if(mHolder !== '' && dHolder !== '' && selectedService){
            setIsLoadDate(true);
            api(`portfolio/user_landing/free_time/?sv=${selectedService}&d=${dHolder + '.' + mHolder + '.' + yHolder}`)
            .then((response)=>{
                if (response.status === 200) {
                    setTimeData(response.data.times)
                    setNotWorking(false)
                    setSelectedDate(mHolder + '.' + dHolder + '.' + yHolder)
                    setNotSetService(false)
                }
            })
            .catch((err)=>{
                if(err.response.data.detail){
                    setErrors(err?.response?.data?.detail)
                }
                if (err.response.status === 400){
                    setTimeData([])
                    // setSelectedDate(null)
                    setNotWorking(true)
                    setSelectedDate(mHolder + '.' + dHolder + '.' + yHolder)
                }
                // if (err.response.status === 500){
                //     setNotSetService(true)
                // }
                else {
                    setNotSetService(false)
                }
            })
            .finally(()=>setIsLoadDate(null))
        }
    },[selectedService,mHolder,dHolder,yHolder])
    function sendRecord(){
        setSendData(true)
        api.post('portfolio/user_landing/create_record/',
            {
                name: nameHolder,
                phone: phoneHolder,
                service: selectedService,
                date: `${dHolder}.${mHolder}.${yHolder}`,
                time: selectedTime,
                comment: commentHolder
            })
            .then((response)=>{
                if (response.status === 201){
                    setFeedbackV(false)
                    setSuccessModalV(true)
                    clearForms()
                    setTimeout(() => {
                        setSuccessModalV(false)
                    }, 3000);
                    // work this
                    dispatch(getMastersShedule({
                        id: telegramChatId,
                        year: moment().year(),
                        monthe: moment().month() + 1
                  }))
                }
            })
            .catch((err)=>{
                if (err.response.status === 400) {
                    error(err.response.data.detail)
                }
            })
            .finally(()=> {
                setTimeData([])
                setSendData(false)
            })
    }

    function sendFeedback(){
        api.post('portfolio/user_landing/send_grade/',
            {
                name: nameFeedHolder,
                phone: phoneFeedHolder,
                comment: commentFeedHolder,
                grade: gradeFeedHolder,
                telegram_id: telegramChatId,
            })
            .then((response)=>{
                if (response.status === 200){
                    setModalV(false)
                    setSuccessFeedModalV(true)
                    setFeedbackData([response.data, ...feedbackData])
                    setTimeout(() => {
                        setSuccessFeedModalV(false)
                    }, 3000);
                }
            })
            .catch((err) => {
                if (err.response.status === 403 ){
                    error(err.response.data.detail)
                }
            })
    }

    function clearForms(){
        setNameHolder('')
        setPhoneHolder('')
        setSelectedService('')
        setSelectedDate(null)
        setSelectedTime(null)
        setCommentHolder('')
        setNotSetService(false)
        setYHolder('')
        setMHolder('')
        setDHolder('')
    }

    const error = (text) => {
        message.error(text);
    }
    useEffect(()=>{
        setSelectedTime(selectedTime)
    }, [selectedTime])    

    const getFreeDay = (value)=>{
        setMHolder(value);
        dispatch(getMastersShedule({
            id: telegramChatId,
            year: yHolder,
            monthe: value
        }))
    }
    const getCurrentDay = (value)=>{
        if(value  !== null) {
            let day = String(value).split(' ')[2]
            setDHolder(day)
            setMHolder(value.getMonth() + 1)
            setYHolder(String(value)?.split(' ')[3])
            setNotSetService(false)
            } 
            if(value == 'Invalid Date') {
                setErrors('Невалидная дата')
                setNotSetService(true)
            // setSelectedDate(mHolder  + '.' + dHolder + '.' + yHolder)
        }else {
            setNotSetService(false)
        }
    }
    
    const closeDatePicker = () => {
        // dispatch(getMastersShedule({
        //     id: telegramChatId,
        //     year: moment().year(),
        //     monthe: moment().month() + 1
        //   }))
          
    }

      const changeMonth = (month) => {
        let year = String(month).split(' ')[3]
        let current_month = month.getMonth()
        setDHolder('')
        setMHolder(month.getMonth() + 1)
        setYHolder(String(month).split(' ')[3])
        dispatch(getMastersShedule({
            id: telegramChatId,
            year: year,
            monthe: current_month + 1,
        }))
      };

    //   const [openCalendar, setOpenCalendar] = useState(false)
    //   useEffect(() => {
    //     let fieldNameElement = document.getElementsByClassName('MuiButton-label').childNodes[0];
    //     console.log(fieldNameElement);
    //     fieldNameElement.textContent = "Отмена";
    //     fieldNameElement.innerHTML = 'Отмена';
    //   }, [openCalendar])
      

        function filterWeekends(date) {
        // !! dont look this strings )))
        return shedulesMaster[0]?.working === false && date.getTime() === new Date(`${shedulesMaster[0]?.date?.split('.')[2]}-${shedulesMaster[0]?.date?.split('.')[1]}-${shedulesMaster[0]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[1]?.working === false && date.getTime() === new Date(`${shedulesMaster[1]?.date?.split('.')[2]}-${shedulesMaster[1]?.date?.split('.')[1]}-${shedulesMaster[1]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[2]?.working === false && date.getTime() === new Date(`${shedulesMaster[2]?.date?.split('.')[2]}-${shedulesMaster[2]?.date?.split('.')[1]}-${shedulesMaster[2]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[3]?.working === false && date.getTime() === new Date(`${shedulesMaster[3]?.date?.split('.')[2]}-${shedulesMaster[3]?.date?.split('.')[1]}-${shedulesMaster[3]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[4]?.working === false && date.getTime() === new Date(`${shedulesMaster[4]?.date?.split('.')[2]}-${shedulesMaster[4]?.date?.split('.')[1]}-${shedulesMaster[4]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[5]?.working === false && date.getTime() === new Date(`${shedulesMaster[5]?.date?.split('.')[2]}-${shedulesMaster[5]?.date?.split('.')[1]}-${shedulesMaster[5]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[6]?.working === false && date.getTime() === new Date(`${shedulesMaster[6]?.date?.split('.')[2]}-${shedulesMaster[6]?.date?.split('.')[1]}-${shedulesMaster[6]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[7]?.working === false && date.getTime() === new Date(`${shedulesMaster[7]?.date?.split('.')[2]}-${shedulesMaster[7]?.date?.split('.')[1]}-${shedulesMaster[7]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[8]?.working === false && date.getTime() === new Date(`${shedulesMaster[8]?.date?.split('.')[2]}-${shedulesMaster[8]?.date?.split('.')[1]}-${shedulesMaster[8]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[9]?.working === false && date.getTime() === new Date(`${shedulesMaster[9]?.date?.split('.')[2]}-${shedulesMaster[9]?.date?.split('.')[1]}-${shedulesMaster[9]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[10]?.working === false && date.getTime() === new Date(`${shedulesMaster[10]?.date?.split('.')[2]}-${shedulesMaster[10]?.date?.split('.')[1]}-${shedulesMaster[10]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[11]?.working === false && date.getTime() === new Date(`${shedulesMaster[11]?.date?.split('.')[2]}-${shedulesMaster[11]?.date?.split('.')[1]}-${shedulesMaster[11]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[12]?.working === false && date.getTime() === new Date(`${shedulesMaster[12]?.date?.split('.')[2]}-${shedulesMaster[12]?.date?.split('.')[1]}-${shedulesMaster[12]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[13]?.working === false && date.getTime() === new Date(`${shedulesMaster[13]?.date?.split('.')[2]}-${shedulesMaster[13]?.date?.split('.')[1]}-${shedulesMaster[13]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[14]?.working === false && date.getTime() === new Date(`${shedulesMaster[14]?.date?.split('.')[2]}-${shedulesMaster[14]?.date?.split('.')[1]}-${shedulesMaster[14]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[15]?.working === false && date.getTime() === new Date(`${shedulesMaster[15]?.date?.split('.')[2]}-${shedulesMaster[15]?.date?.split('.')[1]}-${shedulesMaster[15]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[16]?.working === false && date.getTime() === new Date(`${shedulesMaster[16]?.date?.split('.')[2]}-${shedulesMaster[16]?.date?.split('.')[1]}-${shedulesMaster[16]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[17]?.working === false && date.getTime() === new Date(`${shedulesMaster[17]?.date?.split('.')[2]}-${shedulesMaster[17]?.date?.split('.')[1]}-${shedulesMaster[17]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[18]?.working === false && date.getTime() === new Date(`${shedulesMaster[18]?.date?.split('.')[2]}-${shedulesMaster[18]?.date?.split('.')[1]}-${shedulesMaster[18]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[19]?.working === false && date.getTime() === new Date(`${shedulesMaster[19]?.date?.split('.')[2]}-${shedulesMaster[19]?.date?.split('.')[1]}-${shedulesMaster[19]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[20]?.working === false && date.getTime() === new Date(`${shedulesMaster[20]?.date?.split('.')[2]}-${shedulesMaster[20]?.date?.split('.')[1]}-${shedulesMaster[20]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[21]?.working === false && date.getTime() === new Date(`${shedulesMaster[21]?.date?.split('.')[2]}-${shedulesMaster[21]?.date?.split('.')[1]}-${shedulesMaster[21]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[22]?.working === false && date.getTime() === new Date(`${shedulesMaster[22]?.date?.split('.')[2]}-${shedulesMaster[22]?.date?.split('.')[1]}-${shedulesMaster[22]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[23]?.working === false && date.getTime() === new Date(`${shedulesMaster[23]?.date?.split('.')[2]}-${shedulesMaster[23]?.date?.split('.')[1]}-${shedulesMaster[23]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[24]?.working === false && date.getTime() === new Date(`${shedulesMaster[24]?.date?.split('.')[2]}-${shedulesMaster[24]?.date?.split('.')[1]}-${shedulesMaster[24]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[25]?.working === false && date.getTime() === new Date(`${shedulesMaster[25]?.date?.split('.')[2]}-${shedulesMaster[25]?.date?.split('.')[1]}-${shedulesMaster[25]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[26]?.working === false && date.getTime() === new Date(`${shedulesMaster[26]?.date?.split('.')[2]}-${shedulesMaster[26]?.date?.split('.')[1]}-${shedulesMaster[26]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[27]?.working === false && date.getTime() === new Date(`${shedulesMaster[27]?.date?.split('.')[2]}-${shedulesMaster[27]?.date?.split('.')[1]}-${shedulesMaster[27]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[28]?.working === false && date.getTime() === new Date(`${shedulesMaster[28]?.date?.split('.')[2]}-${shedulesMaster[28]?.date?.split('.')[1]}-${shedulesMaster[28]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[29]?.working === false && date.getTime() === new Date(`${shedulesMaster[29]?.date?.split('.')[2]}-${shedulesMaster[29]?.date?.split('.')[1]}-${shedulesMaster[29]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[30]?.working === false && date.getTime() === new Date(`${shedulesMaster[30]?.date?.split('.')[2]}-${shedulesMaster[30]?.date?.split('.')[1]}-${shedulesMaster[30]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[31]?.working === false && date.getTime() === new Date(`${shedulesMaster[31]?.date?.split('.')[2]}-${shedulesMaster[31]?.date?.split('.')[1]}-${shedulesMaster[31]?.date?.split('.')[0]}T00:00`).getTime()
    }
      // 
    const [isCopySuccess, setIsCopySuccess] = useState(false)
    useEffect(() => {
     setTimeout(() => {
        setIsCopySuccess(false)
     }, 2000);
    }, [isCopySuccess])
    

    return (
        <Spin className="spinner_loading"  size="large" spinning={isLoading || sendData}>
             {userData.telegram_is_active ? 
             <div className="landing">
                <div className="landing_wrapper">
                    <div className="header"></div>
                    <div className="section">
                        <div className="section_main_desktop">
                            <div className="section_user">
                                <div style={{backgroundImage: `url(${userData.avatar})`, borderRadius: '50%'}} className="user_img"></div>
                                <div className="user_name">{userData.first_name !== '' ? userData.first_name + " " : "" }{ userData.last_name !== '' ?  userData.last_name : ''}</div>
                                <Tooltip placement="right" title={userData.rating?.toFixed(1)} className="user_raiting">
                                    <div style={{display: 'flex'}}>
                                        <Rate style={{color: '#F6BB62'}} disabled value={userData.rating} allowHalf/>
                                        <div className="user_raiting_number">{userData.rating?.toFixed(1)}</div>
                                    </div>
                                </Tooltip>
                                <div onClick={() => {
                                setFeedbackV(true)
                                }} className="btn_create_order">
                                    <span>Записаться</span>
                                </div>
                            </div>
                            <div className="section_about_user">
                                <div className="about_user_left">
                                    <div className="about_user_title">Обо мне</div>
                                    <div className="about_user_text">{userData.about ? userData.about : 'Описание отсутствует'}</div>
                                </div>
                                <div className="about_user_right">
                                    <div className="reviews_title">Отзывы <span onClick={()=> setModalV(true)} className="rewiews_title_img"></span></div>
                                    <div className="reviews_main">
                                        <div className="reviews_main_wrapper">
                                            {feedbackData ? feedbackData.map((elem)=> <div key={elem.id} className="rewiews_user">
                                            <Avatar src="https://joeschmoe.io/api/v1/random" className="rewiews_user_img"/>
                                            <Tooltip placement="left" className="grade_wrapper">
                                                <Rate style={{color: '#F6BB62'}} className='grade' disabled value={elem.grade} allowHalf></Rate>
                                                <div className="rewiews_grade_raiting">{elem.grade + '.0'}</div>
                                            </Tooltip>
                                            <div className="rewiews_user_client">{elem.client}</div>
                                            <div className="rewiews_user_comment">{elem.comment}</div>
                                            <div className="rewiews_user_date">{elem.created}</div>
                                            </div>)   : "Список отзывов пуст"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="section_services">
                                <div className="services_title">Услуги</div>
                                <div className="services_block">
                                    {servicesData.map((elem)=> <div key={elem.id} onClick={() => {
                                    setSelectedService(elem.id)
                                    setFeedbackV(true)
                                    }} className="service">
                                        <div className="service_wrapper">
                                            <div style={{backgroundImage: `url(${elem.img})`}} className="service_img"></div>
                                            <div className="service_img_block_info">
                                                <div className="service_info_title">{elem.name}</div>
                                                <div className="service_info_text">{elem.description ? elem.description : 'Описание отсутствует'}</div>
                                                <div className="service_info_group">
                                                    <div className="service_info_cost">Стоимость: {elem.cost} ₽</div>
                                                    <div className="service_info_duration">Длительность: {elem.duration}</div>
                                                </div>
                                                <div className="service_info_btn">записаться</div>
                                            </div>
                                        </div>
                                        <div className="service_img_wrapper"></div>
                                    </div>)}
                                </div>
                            </div>
                        </div>

                        {/* mobile version */}
                        <div className="section_main_mobile">
                            <div className="section_user">
                                <div style={{backgroundImage: `url(${userData.avatar})`, borderRadius: '50%'}} className="user_img"></div>
                                <div className="user_name">{userData.first_name !== '' ? userData.first_name + " " : "" }{ userData.last_name !== '' ?  userData.last_name : ''}</div>
                                <Tooltip placement="right" title={userData.rating?.toFixed(1)} className="user_raiting">
                                    <div style={{display: 'flex'}}>
                                        <Rate style={{color: '#F6BB62'}} disabled value={userData.rating} allowHalf/>
                                        <div className="user_raiting_number">{userData.rating?.toFixed(1)}</div>
                                    </div>
                                </Tooltip>
                                <div onClick={() => {
                                setFeedbackV(true)
                                }} className="btn_create_order">
                                    <span>Записаться</span>
                                </div>
                            </div>
                            <div className="section_about_user">
                                <div className="about_user_left">
                                    <div className="about_user_title">Обо мне</div>
                                    <div className="about_user_text">{userData.about ? userData.about : 'Описание отсутствует'}</div>
                                </div>
                                <div className="section_services">
                                <div className="services_title">Услуги</div>
                                <div className="services_block">
                                    {servicesData.map((elem)=> <div key={elem.id} onClick={() => {
                                    setSelectedService(elem.id)
                                    setFeedbackV(true)
                                    }} className="service">
                                        <div className="service_wrapper">
                                            <div style={{backgroundImage: `url(${elem.img})`}} className="service_img"></div>
                                            <div className="service_img_block_info">
                                                <div className="service_info_title">{elem.name}</div>
                                                <div className="service_info_text">{elem.description ? elem.description : 'Описание отсутствует'}</div>
                                                <div className="service_info_group">
                                                    <div className="service_info_cost">Стоимость: {elem.cost} ₽</div>
                                                    <div className="service_info_duration">Длительность: {elem.duration}</div>
                                                </div>
                                                <div className="service_info_btn">записаться</div>
                                            </div>
                                        </div>
                                        <div className="service_img_wrapper"></div>
                                    </div>)}
                                </div>
                                </div>
                                <div className="about_user_right">
                                    <div className="reviews_title">Отзывы <span onClick={()=> setModalV(true)} className="rewiews_title_img"></span></div>
                                    <div className="reviews_main">
                                        <div className="reviews_main_wrapper">
                                            {feedbackData ? feedbackData.map((elem)=> <div key={elem.id} className="rewiews_user">
                                            <Avatar src="https://joeschmoe.io/api/v1/random" className="rewiews_user_img"/>
                                            <Tooltip placement="left" className="grade_wrapper">
                                                <Rate style={{color: '#F6BB62'}} className='grade' disabled value={elem.grade} allowHalf></Rate>
                                                <div className="rewiews_grade_raiting">{elem.grade + '.0'}</div>
                                            </Tooltip>
                                            <div className="rewiews_user_client">{elem.client}</div>
                                            <div className="rewiews_user_comment">{elem.comment}</div>
                                            <div className="rewiews_user_date">{elem.created}</div>
                                            </div>)   : "Список отзывов пуст"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end mobile verison */}
                    </div>
                    <div className="section_botton">IT-Power</div>
                </div>
                <Modal className={'modal-record'} footer={null} onCancel={() => {
                    setFeedbackV(false)
                    }} title="Запись" visible={feedbackV}>
                    <Form onFinish={sendRecord} className={'service-form'}>
                    <Input value={nameHolder} htmlType={'text'} onChange={((e) => {
                    setNameHolder(e.target.value)
                    })} required className={'form-input'} placeholder="Имя"/>

                    <InputMask mask="+7(999)999-99-99" value={phoneHolder} onChange={((e) => {
                    setPhoneHolder(e.target.value)
                    })} required placeholder={'Номер телефона'} className={'form-input input_phone'} />

                    {/* <Input id={'phone-input'} value={phoneHolder} onChange={((e) => {
                    setPhoneHolder(e.target.value)
                    })} required placeholder={'Номер телефона'} className={'form-input'} addonBefore={'+7'}/> */}

                    <select value={selectedService} required onChange={(e) => {
                    setTimeData([])
                    setSelectedService(e.target.value)
                    }}
                    className={'ant-input form-input email-select current'}>
                    <option selected disabled className={'pre-selected'} value={""}>Услуга</option>
                    {servicesData.map(item => (
                    <option className="option_duration" key={item.id} value={item.id}>{item.name + ' - ' + item.duration}</option>
                    ))}
                    </select>
                    <div className={'dates-block'}>
                    {selectedService && 
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>

                    <KeyboardDatePicker
                        onMonthChange={(month)=> changeMonth(month)}
                        format="dd/MM/yyyy"
                        label={selectedDate === null ? `Выберите удобную дату` : dHolder + '/' + mHolder + '/' + yHolder}
                        value={selectedDate}
                        onChange={getCurrentDay}
                        shouldDisableDate={filterWeekends}
                        onClose={()=>closeDatePicker()}
                        cancelLabel={
                            <Button color="default" disableElevation className="decline_calendar">
                              Отмена
                            </Button>
                          }
                        error={''}
                        invalidDateMessage={''}
                        invalidLabel={''}
                        
                        // rifmFormatter={dateFormatter}
                        // onClick={()=> setOpenCalendar(!openCalendar)}
                    />
                    
                    </MuiPickersUtilsProvider>
                    }
                    </div>
                    {notWorking &&
                    <Alert className={'form-input'} message={errors} type="error"/>
                    }
                    {notSetService ? selectedService !== '' && 
                    <Alert className={'form-input'} type="error" message={errors} />
                    : <></>
                    }
                    {loadDate == null ? timeData.length > 0 &&
                    <div className={'time-block'}>
                    {timeData.map(item => (
                    <div onClick={() => {
                    setSelectedTime(item)
                    }} className={'time-item' + (selectedTime === item ? ' time-item__selected' : '')}
                    key={item} value={item}>{item}</div>
                    ))}
                    </div>
                    :  <Spin  size="large" spinning={loadDate}></Spin>
                    }
                    <TextArea onChange={((e) => {
                    setCommentHolder(e.target.value)
                    })} placeholder="Комментарий" className={'form-input'} allowClear/>
                    <div><Switch required checked={recordCheck} onChange={(e) => {
                    setRecordCheck(e)
                    }} className={'form-switch'}/> Согласен(-а) на обработку данных *
                    </div>
                    <div className="form-buttons">
                    <Button className={"submit-button"} onClick={() => {
                    setFeedbackV(false)
                    }}>Отмена</Button>
                    <Button
                    disabled={recordCheck === false || notWorking === true || nameHolder === '' || phoneHolder.includes('_') || selectedService === null || selectedDate === null || selectedTime === null}
                    htmlType="submit">Записаться</Button>

                    </div>
                    </Form>
                </Modal>
                <Modal footer={null} onCancel={() => {
                    setModalV(false)
                    }} title="Добавить отзыв" visible={modalV}>
                    <Form onFinish={sendFeedback} className={'service-form'}>
                    <Input onChange={(e) => {
                    setNameFeedHolder(e.target.value)
                    }} htmlType={'text'} required className={'form-input'} placeholder="Имя"/>
                    {/* <Input  id={'phone-input'} onChange={(e) => {
                    setPhoneFeedHolder(e.target.value)
                    }} required placeholder={'Номер телефона'} className={'form-input'} addonBefore={'+7'}/> */}

                    <InputMask mask="+7(999)999-99-99" id={'phone-input'} onChange={(e) => {
                    setPhoneFeedHolder(e.target.value)
                    }} required placeholder={'Номер телефона'} className={'form-input input_phone'} />
                    <Rate onChange={(e) => {
                    setGradeFeedHolder(e)
                    }} required className={'feedback-rating '}/>
                    <TextArea onChange={(e) => {
                    setCommentFeedHolder(e.target.value)
                    }} placeholder="Комментарий" className={'form-input'} allowClear/>
                    <div><Switch value={checkFeedHolder} onChange={(e) => {
                    setCheckFeedHolder(e)
                    }} required defaultChecked className={'form-switch'}/> Согласен(-а) на обработку данных *
                    </div>
                    <div className="form-buttons">
                    <Button id={'cancel-button'} className={"submit-button form-button cancel-button"} onClick={() => {
                    setModalV(false)
                    }}>Отмена</Button>
                    <Button className={"form-button"} disabled={checkFeedHolder === false || gradeFeedHolder === null || phoneFeedHolder === null}
                    htmlType="submit">Создать</Button>

                    </div>
                    </Form>
                </Modal>
            </div>
            
            :  <div className="landing_not_active">
                    <div className="landing_wrapper">
                        <div className="header"></div>
                        <div className="section_not_active_wrapper">
                            <div className="section_not_active">
                                <div className="section_user">
                                    <div style={{backgroundImage: `url(${userData.avatar})`}} className="user_img"></div>
                                    <div className="user_name">{userData.length > 0 ? userData.first_name + " " + userData.last_name : "" }</div>
                                    <Tooltip placement="right" title={userData.rating} className="user_raiting">
                                        <div style={{display: 'flex'}}>
                                            {userData.length > 0 && <><Rate style={{color: '#F6BB62'}} disabled value={userData.rating} allowHalf/>
                                            <div className="user_raiting_number">{userData.rating}</div></>
                                            }   
                                        </div>
                                    </Tooltip>
                                    <div className="user_not_active">Пользователь отключил возможность оставлять заявку</div>
                                    <div onClick={()=> {
                                         var textField = document.createElement('textarea')
                                         textField.innerText = String(telegramChatId)
                                         document.body.appendChild(textField)
                                         textField.select()
                                         document.execCommand('copy')
                                         textField.remove()
                                         setIsCopySuccess(true)
                                    }} className="user_not_active_id">id вашей группы <span>{telegramChatId}</span>
                                    <div onClick={()=> setIsCopySuccess(true)} title="скопировать" className="user_not_active_copy"></div></div>
                                </div>
                            </div>
                        </div>        
                    </div>    
                </div>        }
           
            <Modal style={{zIndex: '99999'}} closable={false} footer={null} visible={errorModal}>
                <Error></Error>
            </Modal>
            <Modal footer={null} onCancel={() => {
                setSuccessFeedModalV(false)
                }} title="Успех" visible={successFeedModalV}>
                <Result
                status="success"
                title="Отзыв"
                subTitle="Ваш отзыв добавлен, спасибо!"
                extra={[
                <Button onClick={() => {
                setSuccessFeedModalV(false)
                }} type="primary" key="console">
                Закрыть
                </Button>,

                ]}
                />
            </Modal>
            <Modal footer={null} onCancel={() => {
                setSuccessModalV(false)
                }} title="Успех" visible={successModalV}>
                <Result
                status="success"
                title="Запись"
                subTitle="Ваша запись успешно сформирована!"
                extra={[
                <Button onClick={() => {
                setSuccessModalV(false)
                }} type="primary" key="console">
                Закрыть
                </Button>,

                ]}
                />
            </Modal>

    {isCopySuccess && <Alert className="alert_success_copy" type="success" message={'айди был скопирован успешно'}/>}
    {telegramChatId === undefined && 
    <div className={'block_not_found'}>
        <div className={'block_not_found_wrapper'}>
            <div className={'not_found_title'}><div className={'not_found_img'}></div><div>Вас приветствует telegram bot, разработанный компаний IT-Power, если вы хотите подключить
            себе данного бота и узнать его функционал, зайдите на сайт it-power.ru</div></div>    
        </div>        
    </div>}
</Spin>
        
    );
}

export default Main;
