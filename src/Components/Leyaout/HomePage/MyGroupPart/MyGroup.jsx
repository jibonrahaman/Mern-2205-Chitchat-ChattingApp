import React, { useEffect, useState } from 'react'
import Flex from '../../../Flex'
import SubHeading from '../SubHeading'
import {PiDotsThreeOutlineVerticalDuotone} from 'react-icons/pi'
import Image from '../../../Image'
import Friend1 from '../../../Photo/Friend1.png'
import Medium from '../Medium'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useSelector } from 'react-redux'
import {MdOutlineGroupOff} from 'react-icons/md'
function MyGroup({className}) {
    const data = useSelector(state => state.userLoginInfo.userInfo)
    const db=getDatabase()
    const[myGroupShow,setmyGroupShow]=useState([])

    useEffect(() => {
        const MyGroupRef = ref(db, 'group/');
        onValue(MyGroupRef, (snapshot) => {
            let arr=[];
            snapshot.forEach((item)=>{
              if(data.uid==item.val().adminId){
                arr.push({
                  groupname:item.val().groupName,
                  grouptagname:item.val().groupTagName,
                  id:item.key,
              })
              }

            })
            setmyGroupShow(arr)          
            })
            
        }, [])
       return (
    <section className={` ${className}`}>
    <div className='mt-7 py-4 pb-9 shadow-shadow px-7 rounded-xl overflow-y-scroll h-[310px]'>
      <Flex className=' justify-between'>
        <SubHeading text='My Groups' className=' text-signBtn' />
        <PiDotsThreeOutlineVerticalDuotone className='mt-1 text-signBtn' />
      </Flex >
      {
       myGroupShow.length==0
       ?
       <MdOutlineGroupOff className='flex justify-center text-5xl mt-14 mx-auto'/>
       :
       myGroupShow.map((item,index)=>{
        return <div key={index} className=' relative '>
       <div className='group'>
         <Flex className=' mt-5 justify-between'>
           <Flex className=" gap-x-4">
             <Image src={Friend1} alt={Friend1} />
             <div className=' mt-2 '>
               <SubHeading text=
               {item.groupname}
               />
               <Medium text=
               {
                 item.grouptagname
               }
                className=' text-xs' />
             </div>
           </Flex>
           

          </Flex>


         <div className='border  mt-2'></div>

       </div>
     {/* {  block &&
       <div className=' '>
         <h2>adshf</h2>
         <h2>hello</h2>
       </div>
     } */}
   </div>

     })
      }

      
    </div>

  </section>
  )
}

export default MyGroup
