import api from "../plugins/axios/api";
import axios from 'axios';
import {Content} from "antd/es/layout/layout";
import Avatar from "antd/es/avatar/avatar";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import { useSearchParams } from "react-router-dom";
import {
    Alert,
    Button,
    Card,
    Comment,
    Spin,
    DatePicker,
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
import Meta from "antd/es/card/Meta";
import Modal from "antd/es/modal/Modal";
import {PlusOutlined} from "@ant-design/icons";
import Error from "../components/FailedPage/Error";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {getMastersShedule} from '../store/mainSlice';
import image from '../media/image_not_found.svg'

const { TextArea } = Input;

function Main() {
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
    // this is day array

    const [arrayHolder, setArrayHolder] = useState([
        moment().year(),
        moment().year() + 1
    ])
    const [arrayMHolder, setArrayMHolder] = useState([])
    // end this is array
    useEffect(() => {
        if(yHolder == moment().year()){
            setArrayMHolder([])
            for(let i = 1; i< 13; i++){
                setArrayMHolder(arrayMHolder=> [...arrayMHolder, {value: i, title: i=='01' ? '????????????' : i=='02' ? '??????????????' :
                i == '03' ? '????????' : i == '04' ? '????????????' : i == '05' ? '??????' : i == '06' ? '????????' :
                i == '07' ? '????????' : i == '08' ? '????????????' : i == '09' ? '????????????????' : i == '10' ? '??????????????' :
                i == '11' ? '????????????' : '??????????????', active: (moment().month() >= i ? 1 : 0)}])
             }   
        } else{
            setArrayMHolder([])
            for(let i = 1; i< 13; i++){
                setArrayMHolder(arrayMHolder=> [...arrayMHolder, {value: i, title: i=='01' ? '????????????' : i=='02' ? '??????????????' :
                i == '03' ? '????????' : i == '04' ? '????????????' : i == '05' ? '??????' : i == '06' ? '????????' :
                i == '07' ? '????????' : i == '08' ? '????????????' : i == '09' ? '????????????????' : i == '10' ? '??????????????' :
                i == '11' ? '????????????' : '??????????????', active: 0}])
             }   
        }
        setMHolder("")
    }, [yHolder])    

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
        let user_id = tg.initDataUnsafe.user.id
        let chat_id;
        try {
            await axios.get(`https://everyservices.itpw.ru/chat/telegram_chat/?user_id=${user_id}`).then((response)=>{ 
            let user_info = response.data
            chat_id = user_info[0].chat_telegram_id 
            setTelegramChatId(chat_id)
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
                                    // ?? ?????????????????? ?????? ???? - ???????????? ???? ????????????
                                })
                                .catch( error => {
                                    // ?? ?????????????????? ???????????? - ???????????? ????????????????
                                    img.src = image;
                                });
                        });
                    })
                await api(`portfolio/user_landing/grades/?telegram_id=${chat_id}`)
                    .then((response)=>{
                        setFeedbackData(response.data)
                    })
             })
           
        } catch (error) {
            
        }
        setIsLoading(false)
    }

    // ?????????????? ?????? ?????????????? ?? ????????????????
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
                    setSelectedDate(dHolder + '.' + mHolder + '.' + yHolder)
                    setNotSetService(false)
                }
            })
            .catch((err)=>{

                if (err.response.status === 400){
                    setTimeData([])
                    setSelectedDate(null)
                    setNotWorking(true)
                }
                if (err.response.status === 500){
                    setNotSetService(true)
                }
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
                phone: '+7' + phoneHolder,
                service: selectedService,
                date: selectedDate,
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
                }
            })
            .catch((err)=>{
                if (err.response.status === 400) {
                    error(err.response.data.detail)
                }
            })
            .finally(()=> {
                setTimeData('')
                setSendData(false)
            })
    }

    function sendFeedback(){
        api.post('portfolio/user_landing/send_grade/',
            {
                name: nameFeedHolder,
                phone: '+7' + phoneFeedHolder,
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
        setSelectedTime('')
        setCommentHolder('')
        setNotSetService(false)
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

    return (
        <Spin className="spinner_loading"  size="large" spinning={isLoading || sendData}>
    <Content className={isLoading ? 'main-container loading' : 'main-container'}>
            <div className={'img-block'}>
                <img src={userData.avatar} alt=""/>
            </div>

            <span className={'name-title'}>{userData.first_name} {userData.last_name}</span>
            <Tooltip placement="right" title={userData.rating}>
            <div>
            <Rate disabled value={userData.rating} allowHalf/>
            </div>
            </Tooltip>
            <Button  onClick={() => {
            setFeedbackV(true)
        }} size={'large'} className={'service-button'}>????????????????????</Button>
            <span className={'services-title'}>????????????</span>
            <div className={'services-list'}>
        {servicesData.map(item => (
            <Card
            key={item.id}
            onClick={() => {
            setSelectedService(item.id)
            setFeedbackV(true)
        }}
            className={'card'}
            hoverable={true}
            cover={
            <img
            alt="example"
            src={item.img}
            className={'card-img'}
            />
        }>
            <Meta
            className={'card-text'}
            title={item.name}
            description={item.description}
            />
            <div className={'card-timeline'}>??????????????????????????????????: {item.duration}</div>
            <div className={'card-price'}>????????: {item.cost} ??????.</div>
            </Card>
            ))}


            </div>
            <div className={'feedback-title'}><span>????????????</span> <Button onClick={() => {
            setModalV(true)
        }} className={'feedback_add-btn'} type="primary" shape="circle" icon={<PlusOutlined/>}/></div>

            <Card className={'feedback-list'}>
        {feedbackData.map(item => (
            <Comment
            key={item.id}
            className={'comment-item'}
            author={<a>{item.client}</a>}
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={item.client}/>}
            content={
            <p>
        {item.comment}
            </p>
        }
            datetime={
            <Tooltip title={item.created}>
            <span>{item.created}</span>
            </Tooltip>
        }

            >
            <Tooltip placement="left" title={item.grade}>
            <div className={'comment-grade-div'}>
            <Rate className={'grade'} disabled value={item.grade}></Rate>
            </div>
            </Tooltip>
            </Comment>
            ))}
            </Card>


            <Modal className={'modal-record'} footer={null} onCancel={() => {
            setFeedbackV(false)
        }} title="????????????" visible={feedbackV}>
            <Form onFinish={sendRecord} className={'service-form'}>
            <Input value={nameHolder} htmlType={'text'} onChange={((e) => {
            setNameHolder(e.target.value)
        })} required className={'form-input'} placeholder="??????"/>
            <Input id={'phone-input'} value={phoneHolder} onChange={((e) => {
            setPhoneHolder(e.target.value)
        })} required placeholder={'?????????? ????????????????'} className={'form-input'} addonBefore={'+7'}/>
            <select value={selectedService} required onChange={(e) => {
            setMHolder('')
            setDHolder('')
            setTimeData('')
            setSelectedService(e.target.value)
        }}
            className={'ant-input form-input email-select current'}>
            <option selected disabled className={'pre-selected'} value={""}>????????????</option>
            {servicesData.map(item => (
            <option key={item.id} value={item.id}>{item.name + ' - ' + item.duration}</option>
            ))}
            </select>
            <div className={'dates-block'}>
            {selectedService && 
                    <>
                    <select required value={yHolder} className={'dates-item form-input'} onChange={(e) => {
                        setYHolder(e.target.value)
                    }} name="year">
                    <option selected disabled value="">????????</option>
                    {arrayHolder && arrayHolder.map(elem => <option key={elem} value={elem}>{elem}</option>)}
                    </select>
                    <select required value={mHolder} className={'dates-item email-select form-input'} onChange={(e) =>
                    getFreeDay(e.target.value)
                    } name="month">
                    <option selected disabled value="">??????????</option>
                    {arrayMHolder.length > 0 && arrayMHolder.map(elem=>
                        <option key={elem.value} value={elem.value} disabled={elem.active}
                        className={elem.active == 0 ? 'option_active' : 'option_disabled'}>{elem.title}</option>
                    )}
                    </select>
                    {mHolder && 
                    <select required value={dHolder} className={'dates-item email-select form-input'} onChange={(e) => {
                    setDHolder(e.target.value)
                    }} name="day">
                        <option disabled selected value="">????????</option>
                        {shedulesMaster && shedulesMaster.map(elem => 
                            <option key={elem.date} disabled={elem.working == false}
                            className={elem.working == false ? 'option_day_disabled' : 'option_day_active'} value={elem.date.split('.')[0]}>{elem.date.split('.')[0]}</option>
                            )}
                    </select>
                    }
                    </>
            }
           
            </div>
        {notWorking &&
            <Alert className={'form-input'} message="???????????? ???? ???????????????? ?? ???????? ????????" type="error"/>
        }
        {notSetService ? selectedService !== '' && 
            <Alert className={'form-input'} type="error" message="????????????????????, ???????????????? ????????????" />
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
        })} placeholder="??????????????????????" className={'form-input'} allowClear/>
            <div><Switch required checked={recordCheck} onChange={(e) => {
            setRecordCheck(e)
        }} className={'form-switch'}/> ????????????????(-??) ???? ?????????????????? ???????????? *
            </div>
            <div className="form-buttons">
            <Button className={"submit-button"} onClick={() => {
            setFeedbackV(false)
        }}>????????????</Button>
            <Button
            disabled={recordCheck === false || notWorking === true || nameHolder === '' || phoneHolder === '' || selectedService === null || selectedDate === null || selectedTime === null}
            htmlType="submit">??????????????</Button>

            </div>
            </Form>
            </Modal>


            <Modal footer={null} onCancel={() => {
            setModalV(false)
        }} title="???????????????? ??????????" visible={modalV}>
            <Form onFinish={sendFeedback} className={'service-form'}>
            <Input onChange={(e) => {
            setNameFeedHolder(e.target.value)
        }} htmlType={'text'} required className={'form-input'} placeholder="??????"/>
            <Input  id={'phone-input'} onChange={(e) => {
            setPhoneFeedHolder(e.target.value)
        }} required placeholder={'?????????? ????????????????'} className={'form-input'} addonBefore={'+7'}/>
            <Rate onChange={(e) => {
            setGradeFeedHolder(e)
        }} required className={'feedback-rating '}/>
            <TextArea onChange={(e) => {
            setCommentFeedHolder(e.target.value)
        }} placeholder="??????????????????????" className={'form-input'} allowClear/>
            <div><Switch value={checkFeedHolder} onChange={(e) => {
            setCheckFeedHolder(e)
        }} required defaultChecked className={'form-switch'}/> ????????????????(-??) ???? ?????????????????? ???????????? *
            </div>
            <div className="form-buttons">
            <Button id={'cancel-button'} className={"submit-button form-button cancel-button"} onClick={() => {
            setModalV(false)
        }}>????????????</Button>
            <Button className={"form-button"} disabled={checkFeedHolder === false || gradeFeedHolder === null || phoneFeedHolder === null}
            htmlType="submit">??????????????</Button>

            </div>
            </Form>
            </Modal>


            <Modal footer={null} onCancel={() => {
            setSuccessModalV(false)
        }} title="??????????" visible={successModalV}>
            <Result
            status="success"
            title="????????????"
            subTitle="???????? ???????????? ?????????????? ????????????????????????!"
            extra={[
            <Button onClick={() => {
            setSuccessModalV(false)
            }} type="primary" key="console">
            ??????????????
            </Button>,

            ]}
            />
            </Modal>

            <Modal footer={null} onCancel={() => {
            setSuccessFeedModalV(false)
        }} title="??????????" visible={successFeedModalV}>
            <Result
            status="success"
            title="??????????"
            subTitle="?????? ?????????? ????????????????, ??????????????!"
            extra={[
            <Button onClick={() => {
            setSuccessFeedModalV(false)
        }} type="primary" key="console">
            ??????????????
            </Button>,

            ]}
            />
            </Modal>


            <Modal closable={false} footer={null} visible={errorModal}>
            <Error></Error>
            </Modal>


    </Content>
        </Spin>

    );
}

export default Main;
