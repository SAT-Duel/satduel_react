import React from "react";
import {Typography} from "antd";
import RenderWithMath from "../RenderWithMath";

const {Paragraph} = Typography;

function QuestionContent({question}) {
    const splitText = (text) => {
        const parts = text.split('\n'); // Split text by \n
        const mainParts = parts.slice(0, -1).join('\n'); // All but the last part
        return mainParts;
    };
    return (
        <div style={{padding: '24px'}}>
            <Paragraph style={{fontSize: '16px', lineHeight: '1.8'}}>
                <RenderWithMath text={splitText(question.question)}/>
            </Paragraph>
        </div>
    );
}

export default QuestionContent;