import React, { useEffect, useState } from 'react';
import {connect, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Button, Divider } from '@material-ui/core';
import { CSSGoalsRightPanel } from "../styles/CSSGoalsRightPanel";

const GoalsRightPanelHeader = ({designerSelected, isDesignerAssigned, user, year, quarter, previousFeedback}) => {
    const classes = CSSGoalsRightPanel();
    const [date, setDate] = useState({q:quarter, y:year});
    const [preManager, setPreManager] = useState('');
    const [preRating, setPreRating] = useState('');

    const data = designerSelected.data[year][Number(quarter.split("Q")[1]-1)];
     
    let PREV_RATING = [];
    let Pre_Rating_String="";
 

    const preData = (() => {
        let index = Number(date.q.split("Q")[1])-1;
        let tyear = index<=0?Number(date.y)-1:date.y;
        index = index<=0?4:index;
        return designerSelected.data[tyear] && designerSelected.data[tyear][index-1]
    })();



    // Shoing Last quarter rating (goals section)
    const getPreRatings = () =>{ 
        let index = Number(quarter.split("Q")[1])-1;
        let tyear = index<=0?Number(year)-1:year;
        index = index<=0?4:index;
        return  designerSelected.data[tyear] && designerSelected.data[tyear][index-1]  
    }   
 
     if(getPreRatings()!=undefined){ 
        if(getPreRatings().values.length!=0){ 
            PREV_RATING = getPreRatings().values;
            Pre_Rating_String = PREV_RATING[0].rating.toString()+", "+PREV_RATING[1].rating.toString()+", "+PREV_RATING[2].rating.toString()+", "+PREV_RATING[3].rating.toString() 
         }else{
            Pre_Rating_String="";
         }
     }
   //  End of Shoing Last quarter rating (goals section)


    useEffect(()=>{
        setDate({q:quarter, y:year});
    }, [designerSelected]);

    const getPreviousFeedback = () => {
        let index = Number(quarter.split("Q")[1])-1;
        let tyear = index<=0?Number(year)-1:year;
        setPreManager(preData.manager);
        setDate({q:"Q"+(index<=0?4:index), y:tyear});
        previousFeedback({values:preData.values}, {...preData.extraFeedback});
        
        setPreRating({q1:preData.values[0].rating, q2:preData.values[1].rating, q3:preData.values[2].rating,q4:preData.values[4].rating });

          
    }

    return (
        <Grid className={classes.topRow} container direction="row" justify="space-between">
            <Grid className={classes.header} container direction="row" justify='space-between' alignContent="center">
                <div>{ designerSelected.name+' '+(data.suffix?data.suffix:'') }</div>
                <Divider flexItem orientation="vertical"/>
                <div>{ designerSelected.designation }</div>
                <Divider flexItem orientation="vertical"/>
                <div>{ date.q }</div>
                <Divider flexItem orientation="vertical"/>
                <div>{ date.y }</div>
                <Divider flexItem orientation="vertical"/>
                 
                {  Pre_Rating_String.length!==0 ? <div style={{fontSize:"12px",lineHeight:"1.5", border:"1px solid",color: "#ffffff", background:"#192cd5"}} >&nbsp;Previous Ratings: { Pre_Rating_String }&nbsp;</div>:""}
            </Grid>
            <Grid className={classes.header} container justify="flex-end" alignContent="center">
            {
                isDesignerAssigned && isDesignerAssigned.toLowerCase()===user.name.toLowerCase() ? 
                (quarter === date.q) ?
                <Button disabled={!preData || preData.values.length===0} variant="contained" color="primary" onClick={getPreviousFeedback}>Previous Feedback</Button>
                :<> <div> &nbsp;  Feedback given by {preManager}</div></>
                : isDesignerAssigned ?<label>Assigned with {isDesignerAssigned}</label> : <label>Not yet assigned</label>
            }
            </Grid>
        </Grid>
    )
}

const stateToProps = state => {
    return {
        designerSelected:state.designers.designerSelected,
        quarter:state.default.quarter,
        user:state.auth.user,
        year:state.default.year
    }
}

GoalsRightPanelHeader.propTypes = {
    user:PropTypes.object,
    designerSelected:PropTypes.object,
    year:PropTypes.string,
    quarter:PropTypes.string,
    previousFeedback:PropTypes.func
}

export default connect(stateToProps, null)(GoalsRightPanelHeader);