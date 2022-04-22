import {Input, Select, Radio, Icon, capitalize, Collapse, FormControl, FormLabel, RadioGroup, FormControlLabel} from '@material-ui/core'
import { useEffect, useReducer, useState } from 'react';

const products = [
  {id:1, name:"CRM", plans:[{id:10, name:"Free", unused_subscriptions:3, total_subscription:3, available_subscriptions:[20,21,22]}, {id:11, name:"Premium", unused_subscriptions:5, total_subscription:5, available_subscriptions:[30, 31, 32,33,34]}]},
  {id:2, name:"HRM", plans:[{id:15, name:"Free", unused_subscriptions:2, total_subscription:3, available_subscriptions:[40,41]}, {id:16, name:"Premium", unused_subscriptions:5, total_subscription:7, available_subscriptions:[50,51,52, 53, 54, 55]}]},
  {id:3, name:"CMS", plans:[{id:25, name:"Free", unused_subscriptions:0, total_subscription:0, available_subscriptions:[]}, {id:26, name:"Premium", unused_subscriptions:0, total_subscription:7, available_subscriptions:[]}]},
]
const initailDataSturcture = {
  licenses: [],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
}

function App() {
  const [inputData, setInputData] = useState([{...initailDataSturcture}]);
  const [licenses, setLicenses] = useState([]);

  const addLicense = (prop) =>{
    const license = licenses.find(license => license.productId == prop.productId && license.userId == prop.userId);
    if(license){
      return setLicenses(prev => {
        const licensesWithoutProduct = prev.filter(license => !(license.productId == prop.productId && license.userId == prop.userId));
        return [...licensesWithoutProduct, prop];
      });

    }
    setLicenses([...licenses, prop]);
    

  }

  const removeLicense  =({ userId, planId, productId}) =>{
    const licensesWithoutLicense = licenses.filter(license =>  !(license.userId == userId && license.planId == planId && license.productId == productId));
    setLicenses(licensesWithoutLicense);
  }
  
  const addLicenseHandler = ({licenseId, userId, planId,productId}) => {
    console.log("HOW MANY TIMES CALLED")
    addLicense({licenseId, userId, planId,productId});
   
    
  }
  const removeLicenseHandler = (license) => {
   removeLicense(license);
   
  }

  const getUsersByLicenseId = (licenseId) =>{
    return licenses.filter(license => license.planId === licenseId);
  }
  
  const addUserHandler = () => {
    setInputData([...inputData, {...initailDataSturcture}]);
  }
  const removeLicenseByUserId = (userId) => {
    setLicenses(licenses.filter(license => license.userId !== userId));
  }
  const removeUserHandler = (index) => () => {
    setInputData(prevState => {
      const newState = [...prevState];
      newState.splice(index, 1); 
      return newState;
    });
    removeLicenseByUserId(index);
  }
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(inputData);
  }
  console.log(inputData);
  return (
    <div className="App">
     <h1>Test Love</h1>
     <div style={{width:"600px", margin:"auto", background:"lightgrey", padding:"1rem"}}>
       <form onSubmit={submitHandler}>
        {
          inputData.map((user, index) => {
            return(
              <UserForm user={user} key={index} index={index} setInputData={setInputData} 
              addLicenseHandler={addLicenseHandler} removeLicenseHandler={removeLicenseHandler}
              getUsersByLicenseId={getUsersByLicenseId} licenses={licenses}
              inputData={inputData}
              removeUserHandler={removeUserHandler(index)}
              />
            )
          
          })
        }
        <div>
          <button onClick={addUserHandler}>Add User <Icon>add_circle</Icon></button>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
        </form>
     </div>
    </div>
  );
}

  
const UserForm = ({user, index, setInputData, inputData,removeUserHandler, addLicenseHandler, removeLicenseHandler, getUsersByLicenseId,licenses}) => {
  const changeHandler = ({target:{name,value}}, field) => {
    setInputData(prevState => {
      const newState = [...prevState];
      newState[index][name] = value;
      return newState;
    })
  }
  const removeUser = () => {
    removeUserHandler();
  }
 
  const otherFormFields = Object.keys(user).map((key, ind) => {
    if(key === "licenses"){
      return null
    }
  else{
    return(
      <div key={ind}>
      <label>{capitalize(key)}</label>
      <Input onChange={changeHandler} name={key} value={user[key]}/>
    </div>
    )
  }

  });

 

  return (
    <div>
      {otherFormFields}
      <div>
        <h3>Select Licenses for user</h3>
        {
          products.map((product) => 
            <Product addLicenseHandler={addLicenseHandler} removeLicenseHandler={removeLicenseHandler}
            getUsersByLicenseId={getUsersByLicenseId} licenses={licenses}
            product={product} key={index} userIndex={index}/>
          )
        }
        
      </div>
      <>
      {
        inputData.length > 1 && (
          <button onClick={removeUser}>Remove user</button>
        )
      }
      </>
    </div>
  )


}

const Product = ({product, userIndex, addLicenseHandler, removeLicenseHandler, getUsersByLicenseId, licenses}) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
        <div style={{display:"flex", gap:"1.5rem"}} onClick={() => setOpen(prev => !prev)}>
          <h3>{product.name}</h3>
          <Icon>{open?"expand_less":"expand_more"}</Icon>
        </div>
        <Collapse in={open} style={{width:"100%"}} unmountOnExit={false}>
          <Plans plans={product.plans} 
          addLicenseHandler={addLicenseHandler} removeLicenseHandler={removeLicenseHandler}
          getUsersByLicenseId={getUsersByLicenseId} licenses={licenses}
          productId={product.id} userIndex ={userIndex}/>
        </Collapse>
      </div>
    )
}

const Plans = ({plans, productId, userIndex, addLicenseHandler, removeLicenseHandler, getUsersByLicenseId, licenses}) => {
  // const licensesTaken = TakenLicenses.getInstance();
  // const [licensed, setLicensedUsers] = useState(licensesTaken.getLicenses.call(licensesTaken));
  
  console.log(licenses);
  if(!Array.isArray(plans) || plans.length === 0) return null;
  return (
    <div>
      
      {
        plans.map((plan, index) => {
          return (
            <Plan plan={plan} productId={productId} userIndex={userIndex} 
            selected={!!licenses.find(license => license.planId == plan.id  && license.userId == userIndex)}
            removeLicense={removeLicenseHandler} key={plan.id} 
            addLicense={addLicenseHandler} licensedUsers={getUsersByLicenseId(plan.id)} />
          )
        })
      }

    </div>)
}
const Plan = ({plan, productId, userIndex, addLicense, licensedUsers,removeLicense, selected}) => {
  
  
  
  const changeHandler = (e) => {
    
    if( selected){
      
      
      removeLicense({ userId:userIndex, planId:plan.id, productId:productId});
      
    }else{
 
      addLicense({licenseId:plan.available_subscriptions[licensedUsers.length], userId:userIndex, planId:plan.id, productId:productId});
       
    }
  }
 
  console.log(licensedUsers, selected);
  return (
    <div style={{ margin:"1rem 2rem"}}>
       <div style={{display:"flex", gap:"1.5rem"}}>
            <Radio checked={ selected} onClick={changeHandler} value={selected} name="plan" />
            <h4>{plan.name}</h4>
        </div>
           <p>You have {plan.unused_subscriptions - licensedUsers.length } of {plan.total_subscription} available</p>
          
    </div>
  )
}
export default App;
