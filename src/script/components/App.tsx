import React,{useState,useEffect} from 'react';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Signika Negative:300', 'sans-serif']
  }
});

export const App: React.FC = () => {
    
    const [models,setModels]=useState([]);
    const [years,setYears]=useState([]);
    const [coverage,setCoverage]=useState([]);
    
    const getData=()=>{
      fetch('data/coverage.json'
      ,{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      }
      )
        .then(function(response){
          return response.json();
        })
        .then(function(coverageJson) {
            const modelCoverage:any = new Object();
            const coverageYears:any = new Object();

            for (let model in coverageJson["coverage"]) {
                
                /* TODO fix coverage assignment from coverageJson["coverage"] */
                coverageJson["years"].forEach(function (year:string) {
                    coverageYears[year] = 'false';
                    if(coverageJson["coverage"][model].includes(year)){
                        coverageYears[year] = 'true';
                    }
                });
                
                modelCoverage[model] = coverageYears;
            }

            setModels(coverageJson["vehicle-models"]);
            setYears(coverageJson["years"]);
            setCoverage(modelCoverage);
        });
    }
    
    const toggleState = (model:any,year:any) => {
        const modelCoverage: Array<string> = coverage[model];
        
        /*
        # TODO update coverage states.
        # if true, set false
        # if false set true
        if(modelCoverage.includes(year)){
            for( var i = 0; i < modelCoverage.length; i++){ 
                if ( modelCoverage[i] === year) { 
                    modelCoverage.splice(i, 1); 
                }
            }
        } else {
            modelCoverage.push(year);
        }
        */

        let updateYears:any = coverage;
        updateYears[model] = modelCoverage;
        setCoverage(updateYears);
        updateCardGrid();
    };

    const updateCardGrid = () => {
        for (let model in coverage) {
            for (let year in coverage[model]) {
                if(coverage[model][year] === 'true'){
                    document.getElementById(model+'_'+year)?.classList.add('active');
                } else {
                    document.getElementById(model+'_'+year)?.classList.remove('active');
                }
            }
        }
    };

    const ToggleCell = ({model,year}:{model:string,year:string}) => {
        return (
            <td 
                id={model+'_'+year}
                onClick={(e)=>toggleState(model,year)}
            ></td>
            );
    };

    useEffect(()=>{
        getData();
    },[]);

    useEffect(()=>{
        updateCardGrid();
    },[coverage]);

    return (
        <React.Fragment>    
            <table className="cardgrid">
                <thead>
                    <tr>
                        <th></th>
                        {years && years.map((year: number, k: number) => {
                            return (
                                <th key={k}><span>{year}</span></th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {models && models.map((model: string, k: number) => {
                            return (
                                <tr key={k}>
                                    <th><span>{model}</span></th>
                                    {years && years.map((year: string, k: number) => {
                                        return <ToggleCell key={k} model={model} year={year}  />;
                                    })}
                                </tr>
                            );
                    })}
                </tbody>
            </table>
        </React.Fragment> 
    );
}