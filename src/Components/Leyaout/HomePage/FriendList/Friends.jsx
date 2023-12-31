import { useEffect, useState } from 'react'
import Flex from '../../../Flex'
import SubHeading from '../SubHeading'
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi'
import Friend1 from '../../../Photo/Friend1.png'
import Image from '../../../Image'
import Medium from '../Medium'
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'


function Friends({ className,friendsClass}) {
  const data = useSelector(state => state.userLoginInfo.userInfo)
  const [friendAccept, setfriendAccept] = useState([])
  const db = getDatabase();

  useEffect(() => {
    const friendAcceptList = ref(db, 'friend/');
    onValue(friendAcceptList, (snapshot) => {
      let arr = []
      snapshot.forEach(item => {
        if (data.uid === item.val().receiverid || data.uid === item.val().senderid) {
          arr.push({ ...item.val(),frId:item.key })
        }

      })
      setfriendAccept(arr)
    })
  }, [])
  
   const handleBlockList=(item)=>{
    if(data.uid==item.senderid){
      set(push(ref(db, 'block/')), {
     block:item.receivername,
     blockid:item.receiverid,
     blockby:item.sendername,
     blockbyid:item.senderid,
    }).then(() => {
        remove(ref(db, 'friend/' + item.frId))
        })
    }else{
      set(push(ref(db, 'block/')), {
        block:item.sendername,
        blockid:item.senderid,
        blockby:item.receivername,
        blockbyid:item.receiverid
        }).then(() => {
           remove((ref(db, 'friend/' + item.frId)))
      })
    }
   }


  return (
    <section className={` ${className}`}>
      <div className={`pt-4 pb-9 shadow-shadow px-7 rounded-xl overflow-y-scroll  ${friendsClass}`}>
        <Flex className=' justify-between'>
          <SubHeading text='Friends' className=' text-signBtn' />
          <PiDotsThreeOutlineVerticalDuotone className='mt-1 text-signBtn' />
        </Flex >

        <div className=' relative '>
          {friendAccept.map(item => (
            <div className='group'>
              <Flex className=' mt-5 justify-between'>
                <Flex className=" gap-x-4">
                  <Image src={Friend1} alt={Friend1} />
                  <div className=' mt-2 '>
                    <SubHeading text=
                      {
                        data.uid == item.senderid ? item.receivername : item.sendername
                      }
                    />
                    <Medium text='Dinner?' className=' text-xs' />
                  </div>
                </Flex>
                <div className='  '>
                  <p className=' text-center text-[8px] font-nos group-hover:scale-50 duration-700'>Friend</p>
                  <button onClick={() => handleBlockList(item)} className='bg-red-600 hover:bg-red-900 duration-700 hover:scale-110 text-white py-1 px-5 text-lg rounded-lg'>Block</button>
                </div>
               </Flex>
              <div className='border  mt-2'></div>
            </div>
          ))}
         
        </div>
      </div>

    </section>
  )
}

export default Friends
