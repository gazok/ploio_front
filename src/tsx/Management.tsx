import { Button, Caption1, Card, CardHeader, Checkbox, Divider, Input, Label, Text, Tooltip, makeStyles, shorthands, tokens, useId } from '@fluentui/react-components';
import { MoreHorizontal20Regular, Search32Regular, Add24Regular, Delete24Regular, ArrowClockwise28Regular, SettingsCogMultiple24Regular } from '@fluentui/react-icons'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import '../css/Management.css';
import { ModuleData, ModuleJsonData } from './types';
import dataM from'../public/data_module.json';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';

const useStyles = makeStyles({
  field: {
    display: "grid",
    gridRowGap: "5px",
    ...shorthands.padding(tokens.spacingHorizontalMNudge),
  },
  filledLighter: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    "> label": {
      color: tokens.colorNeutralForegroundInverted2,
    },
  },
  filledDarker: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    "> label": {
      color: tokens.colorNeutralForegroundInverted2,
    },
  },

  image: {
    maxWidth: "100px",
    maxHeight: "100px",
  },
  logo: {
    ...shorthands.borderRadius("4px"),
    width: "48px",
    height: "48px",
  },

  button: {
    alignSelf: "center",
    width: "100%",
    marginTop: "10px",
  }
});
//use card footer?

const LogicModule = async (callback: (data: any) => void, callback2: (data: any) => void, callback3: (data: any) => void) => {
  callback(dataM);

  let count = 0;
  for(let item in dataM.modules) {
    count++;
  }
  //console.log(count);
  callback3(count);

  return;
}

//let checkedList: boolean[] = [];

const CreateCard = (props) => {
  const styles = useStyles();

  const [ chk, setChk] = useState<boolean>(false);
  //checkedList.push(chk);

  return (
    <Card className='card'>
      <CardHeader 
        image={<SettingsCogMultiple24Regular />} //<img className={styles.logo} src={"shipicon.png"} alt="App logo" />
        header={<Text weight="semibold">{props.item.Name} </Text>}
        description={<div>
          <Caption1 >{props.item.status}</Caption1>
          </div>}
        action={
          <div>
            <Checkbox 
              checked={chk}
              onChange={()=>{
                setChk(!chk);
                props.checkHandler(props.item.GUID, chk);
                //props.print();
              }}
              disabled={props.item.status=='active' ? true : false}
            />
          </div>
        }
      />
      <Label>Description<br></br>Card {props.item.GUID}</Label>
    </Card>
  );
}

const Management = (Props) => {
  const styles = useStyles();

  const [ moduleData, setModuleData] = [Props.moduleData, Props.setModuleData];
  const [ moduleSearchData, setModuleSearchData] = [Props.moduleSearchData, Props.setModuleSearchData];
  const [ moduleNumber, setModuleNumber] = useState<number>(0);
  let moduleCount = -1; //0이면 1개라는 뜻.

  const [checkedItems, setCheckedItems] = [Props.checkedItems, Props.setCheckedItems];

  //search
  //const inputRef = useRef<HTMLInputElement | null>(null);
  //const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    LogicModule(setModuleData, setModuleSearchData, setModuleNumber);
    
  }, []);

  useEffect(() => {
    if(moduleData) {
      console.log(moduleData);
      let moduleSD: ModuleData[] = [];
      moduleData.modules.forEach((item: ModuleData) => {
        moduleSD.push(item);
      });

      setModuleSearchData(moduleSD);
    }
  }, [moduleData]);

  const checkedItemHandler = (id: string, isChecked: boolean) => { //id: GUID, ischecked가 생각과 반대로 돌아간다.
    if (!isChecked) {
      checkedItems.add(id);
      setCheckedItems(checkedItems);
    } else if (isChecked && checkedItems.has(id)) {
      checkedItems.delete(id);
      setCheckedItems(checkedItems);
    }
  };

  const printInfo = () => {
    console.log(checkedItems);
  }
  
  return (
      <div className='content'>
        <div>
          <section className='card-section'>
            {moduleSearchData && moduleSearchData.map((item) => { return (<CreateCard item={item} checkHandler={checkedItemHandler} print={printInfo} />); })}
            
            <Card className='card'>
              <p>Card2</p>
            </Card>

            <Card className='card'>
              <p>Card3</p>
            </Card>
            <Card className='card'>
              <p>Card3</p>
            </Card>
            <Card className='card'>
              <p>Card3</p>
            </Card>
            <Card className='card'>
              <p>Card3</p>
            </Card>
            <Card className='card'>
              <p>Card3</p>
            </Card>
            <Card className='card'>
              <p>Card3</p>
            </Card>
            <Card className='card'>
              <p>Card3</p>
            </Card>
            <Card className='card'>
              <p>Card10</p>
            </Card>

            <Card className='card'>
              <p>Card11</p>
            </Card>
          </section>
        </div>
      </div>
  );
}

const ManagementM: React.FC = () => {

  const [ moduleData, setModuleData] = useState<ModuleJsonData | null>(null);
  const [ moduleSearchData, setModuleSearchData] = useState<ModuleData[] | null>(null);

  const [checkedItems, setCheckedItems] = useState(new Set());

  //search
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');

  const addItemPost = () => {
    //json fetch(POST)
    console.log(checkedItems);
    /*
    const res: JsonData = await fetch('http://123.108.168.190:8000/summary/tmp/~', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        body: JSON.stringify({
          'email': 'sunghae',
          'password': '1234'
        })
    }).then(response => response.json());
    callback(res);
    */
  }

  const removeItemPost = () => {
    console.log(checkedItems);
    /*
    const res: JsonData = await fetch('http://123.108.168.190:8000/summary/tmp/~', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        body: JSON.stringify({
          'email': 'sunghae',
          'password': '1234'
        })
    }).then(response => response.json());
    callback(res);
    */
  }

  const handleSearch = () => {
    console.log(inputValue);
    let moduleSD: ModuleData[] = [];

    if(moduleData) {
      moduleData.modules.forEach((item: ModuleData) => {
        if(item.Name.includes(inputValue)) {
          moduleSD.push(item);
        }
      });

      console.log(moduleSD);
      setModuleSearchData(moduleSD);
    }
  }

  const handleReset = () => {
    if(moduleData) {
      setModuleSearchData(moduleData.modules);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log('abc')
    setInputValue(e.target.value);
    //wait(10000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]);

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: 'div1-1',
      onRender: () => <Divider vertical/>
    },
    {
      key: 'search',
      text: 'Search',
      iconProps: { iconName: 'Search' },
      onClick: () => handleSearch(),
    },
    {
      key: 'div1-2',
      onRender: () => <Divider vertical/>
    },
    {
      key: 'reset',
      text: 'Reset',
      iconProps: { iconName: 'Refresh' },
      onClick: () => handleReset(),
    },
    {
      key: 'div1-3',
      onRender: () => <Divider vertical/>
    }
  ]; //<CommandBar items={commandBarItems}></CommandBar>

  const commandBarItems2: ICommandBarItemProps[] = [
    {
      key: 'div2-1',
      onRender: () => <Divider vertical/>
    },
    {
      key: 'add',
      text: 'Add',
      iconProps: { iconName: 'ExploreContent' },
      onClick: () => addItemPost(),
    },
    {
      key: 'remove',
      text: 'Remove',
      iconProps: { iconName: 'CollapseContent' },
      onClick: () => removeItemPost(),
    }
  ];

  const MBar = () => {
    return (
      <div className="manage-menu">
        <div style={{marginLeft: '15px'}}>
          <Input ref={inputRef} type="text" placeholder="Search..." value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress} />
        </div>
        <CommandBar items={commandBarItems} />

        <div style={{marginLeft: '50%'}}>
          <CommandBar items={commandBarItems2} />
        </div>
        
      </div>
    );
  };
  
  return (
    <div>
      <MBar />
      <Management moduleData={moduleData} setModuleData={setModuleData} moduleSearchData={moduleSearchData} setModuleSearchData={setModuleSearchData}
        checkedItems={checkedItems} setCheckedItems={setCheckedItems} />
    </div>
  );
}

export { Management, ManagementM };
