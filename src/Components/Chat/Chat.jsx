import React, { useEffect,  useState } from 'react'
import Flex from '../Flex'
import msg from '../Photo/msg.png'
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi'
import signPhoto from "../../assets/SignUpImg.png"
import "../Chat/Chat.css"
import { IoIosSend } from "react-icons/io";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { MdCameraAlt } from "react-icons/md";
import { useSelector } from 'react-redux'
import { getDatabase, onValue, push, ref, set } from 'firebase/database'
import moment from 'moment'
import ModalImage from "react-modal-image";
import { getDownloadURL, getStorage, ref as refs, uploadBytes } from "firebase/storage";
import EmojiPicker from 'emoji-picker-react';

function Chat({ className }) {
  const storage = getStorage();
  const data = useSelector(state => state.userLoginInfo.userInfo)
  const activeFriend = useSelector(state => state.activeChat)

  const [inputSize, setinputSize] = useState(false)
  const [chatMsg, setchatMsg] = useState('')
  const db = getDatabase();
  const [msgShow, setmsgShow] = useState([])
  const [showEmoji,setshowEmoji]=useState(false);
  

  const handleChat = (e) => {
    if (e.target.value.length > 0) {
      setinputSize(true)
    } else {
      setinputSize(false)
    }
    setchatMsg(e.target.value)
   setshowEmoji(false)
  }
  const handleSend = () => {
    if (activeFriend.active.status == 'singleMsg' && chatMsg) {
      set(push(ref(db, 'singleMsg/')), {
        chat: chatMsg,
        msgSendid: data.uid,
        msgSendname: data.displayName,
        msgReceiverid: activeFriend.active.id,
        msgReceivername: activeFriend.active.name,
        date: `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()}, ${new Date().getHours()} : ${new Date().getMinutes()} : ${new Date().getSeconds()} `,
        
      }).then(()=>{
    setchatMsg("")
    setshowEmoji(false)
      })
    }
    else {
    }

  }
  useEffect(() => {
    const singleMsgRef = ref(db, 'singleMsg/');
    onValue(singleMsgRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {
        if (data.uid == item.val().msgSendid || item.val().msgReceiverid == activeFriend.active.id && data.uid == item.val().msgReceiverid || item.val().msgSendid == activeFriend.active.id) {
          arr.push(item.val())
        }
      })
      setmsgShow(arr)
    })
  }, [])

  const handleImg = (e) => {
    const storageRef = refs(storage, 'some-child');
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(push(ref(db, 'singleMsg/')), {
          img: downloadURL,
          msgSendid: data.uid,
          msgSendname: data.displayName,
          msgReceiverid: activeFriend.active.id,
          msgReceivername: activeFriend.active.name,
          date: `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()}, ${new Date().getHours()} : ${new Date().getMinutes()} : ${new Date().getSeconds()} `
        })
      });
    });
  }
  const handleEmoji=(e)=>{
    const emoji = e.emoji;
    setchatMsg(chatMsg+e.emoji)
  

  }

  return (
    <section className={`${className}`}>
      <div className='chatt w-[800px]  h-[690px] shadow-shadow px-14 py-7 rounded-lg '>
        <div className=' rounded-lg   '>

          <div className=''>
            <Flex className=" justify-between  ">
              <Flex className="gap-x-6">
                <div className=' relative'>
                  <img src={msg} alt={msg} />
                  <div className=' w-4 h-4 rounded-full shadow-online bg-[#00FF75] absolute bottom-[6px] right-3'></div>
                </div>
                <div className=' mt-2'>
                  <h3 className=' font-open text-2xl font-bold '>{
                  activeFriend.active.name
                  }</h3>
                  <p>Online</p>
                </div>
              </Flex>
              <PiDotsThreeOutlineVerticalDuotone className=' text-signBtn text-2xl mt-4  font-bold ' />
            </Flex>
            <div className=' border mt-2'></div>
          </div>

          <div className=' py-4 h-[520px]'>
            <div className=' hello  h-full overflow-x-hidden   pl-3 '>
              {
                msgShow.map((item) => (
                  item.msgSendid ==  data.uid  ?
                  item.chat ?
              //  sender text design //
                    <div className=' mt-2 text-right pr-10 '>
                      <div className=' py-2 px-10 inline-block rounded-lg relative bg-signBtn text-white'>
                        <h3 >{item.chat}</h3>
                        <svg
                          className=' absolute bottom-[-2.5px] right-[-8px]' width="20" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.3186 1.17537C13.1181 0.0939677 14.7356 0.0939677 15.5351 1.17537L27.0944 16.8111C28.0703 18.1312 27.1279 20 25.4861 20H2.36753C0.725776 20 -0.216681 18.1312 0.759296 16.8111L12.3186 1.17537Z" fill="#5F35F5" />
                        </svg>
                      </div>
                        <p className=' mr-[20px] mt-1 text-[#87abcb] text-[10px]'>
                        {
                          moment(item.date, "YYYYMMDD hh:mm:ss a").fromNow()
                        }
                      </p>
                    </div>
                    // sender text design//

                    :
                    //  sender  photo design 
              <div className='pr-10'>
              <div className=' mt-6 text-right '>
                <div className=' py-1 px-2 inline-block rounded-lg relative   bg-signBtn   text-white'>
                  <ModalImage className='w-[200px] '
                    small={item.img}
                    large={item.img}
                    alt={item.img}
                    showRotate="true"
                  />
                  <svg
                    className=' absolute bottom-[-2.5px] right-[-8px]  ' width="20" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.3186 1.17537C13.1181 0.0939677 14.7356 0.0939677 15.5351 1.17537L27.0944 16.8111C28.0703 18.1312 27.1279 20 25.4861 20H2.36753C0.725776 20 -0.216681 18.1312 0.759296 16.8111L12.3186 1.17537Z" fill="#5F35F5" />
                  </svg>
                   </div>
                   <p className=' ml-[15px] mt-1 text-[#87abcb] text-[10px]'>
                        {

                          moment(item.date, 'YYYYMMDD hh:mm:ss a').fromNow()

                        }
                      </p>
              </div>
            </div>
              //  sender photo design 
                   
                  

                        : 
                        item.chat ?               
                    // receiver text design //
                    <div className=' mt-14'>
                      <div className='bg-[#F1F1F1] py-2 px-10 inline-block rounded-lg relative'>
                        <h3>{item.chat}</h3>

                        <svg
                          className=' absolute bottom-[-3px] left-[-8px]' width="20" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.3186 1.17537C13.1181 0.0939677 14.7356 0.0939677 15.5351 1.17537L27.0944 16.8111C28.0703 18.1312 27.1279 20 25.4861 20H2.36753C0.725776 20 -0.216681 18.1312 0.759296 16.8111L12.3186 1.17537Z" fill="#F1F1F1" />
                        </svg>
                      </div>
                      <p className=' ml-[15px] mt-1 text-[#87abcb] text-[10px]'>
                        {
                          moment(item.date, 'YYYYMMDD hh:mm:ss a').fromNow()
                        }
                      </p>
                         </div>
                  // receiver text design //

                  :
                    //  receiver photo design //
              <div className=' mt-7  '>
              <div className=' py-1 px-2 inline-block rounded-lg relative   bg-[#F1F1F1]   '>
                <ModalImage className='w-[200px] '
                  small={item.img}
                  large={item.img}
                  alt={item.img}
                  showRotate="true"
                />
                <svg
                  className=' absolute bottom-[-3px] left-[-8px]  ' width="20" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.3186 1.17537C13.1181 0.0939677 14.7356 0.0939677 15.5351 1.17537L27.0944 16.8111C28.0703 18.1312 27.1279 20 25.4861 20H2.36753C0.725776 20 -0.216681 18.1312 0.759296 16.8111L12.3186 1.17537Z" fill="#F1F1F1" />
                </svg>
                </div>
                <p className=' ml-[15px] mt-1 text-[#87abcb] text-[10px]'>
                        {

                          moment(item.date, 'YYYYMMDD hh:mm:ss a').fromNow()

                        }
                      </p>
            </div>
            // //  receiver photo design //
                   
               
                 

                ))
              }




             


                
            </div>
            <div className='border '></div>


          </div>
          <Flex className="gap-x-2 items-center  relative">
            <input onChange={handleChat} value={chatMsg} type="text" placeholder='typing...' className={`py-2 bg-[#F1F1F1]  pl-6 pr-[4.7rem] rounded-xl outline-none ${inputSize ? "w-[95%]" : "w-[80%] "}`} />
            <Flex className={`  absolute ${inputSize ? " top-[11px] right-[60px]" : " top-[10px] right-[150px]"} gap-x-2 text-[#707070]`}>
              <HiOutlineEmojiHappy onClick={()=>setshowEmoji(!showEmoji)} size={22} />
              <label>
                <input onChange={handleImg} type="file" className='hidden' />
                <MdCameraAlt size={22} />
              </label>
              {
                showEmoji && 
                <div className=' absolute top-[-500px] right-16 '>
              <EmojiPicker Emoji Style="Facebook" Height="353"  Theme="Dark" onEmojiClick={(e)=>handleEmoji(e)} />
            </div>
              }
            </Flex>
            <IoIosSend onClick={handleSend} className=' bg-signBtn  text-4xl py-1 px-2 text-white rounded-lg' />
          </Flex>

        </div>

      </div>
    </section>

  )
}

export default Chat
