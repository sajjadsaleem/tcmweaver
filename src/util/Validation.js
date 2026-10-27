import validator from 'validator';
import _ from 'lodash';

const validateSignupData = (data, rules) => {
    const errors = [];

    // console.log('rules=',data,rules)
    if (!_.isEmpty(rules)) {
        rules.forEach((rule, k) => {
            // console.log('rules=',rules)
            const ruleKeys = _.keys(rule)
            const ruleKey = ruleKeys[0]
            const ruleVal = rule[ruleKeys[0]]

            const dataKeys = _.keys(data)
            const dataKey = dataKeys[k]
            const dataVal = data[dataKey]
            // console.log('rule: ',rule[ruleKeys[0]], ruleKeys[0])
            // console.log('dataKeys: ',dataKey, dataVal)

            if (!_.isEmpty(rule)) {
                if (ruleVal.length > 0) {
                    ruleVal.forEach((v) => {
                        // console.log('v: ',ruleKey, dataKey, ruleVal, dataVal, v)
                        if (ruleKey == dataKey && dataKey != undefined) {
                            if (!dataVal && v == 'required') {
                                errors.push({ [ruleKey]: ruleKey + ' field is required' })
                            }
                            if (!dataVal && v == 'email') {
                                if (!validator.isEmail(dataVal)) {
                                    errors.push({ [ruleKey]: ' Invalid ' + ruleKey + ' format' })
                                }
                            }

                            if (_.includes(v, ':')) {
                                const splitStr = _.split(v, ':');
                                if (splitStr.length > 0) {
                                    const val1 = splitStr[0]
                                    const val2 = splitStr[1]
                                    // console.log('val1=',dataVal,val1,val2)
                                    if (_.size(dataVal) < parseInt(val2) && val1 == 'min') {
                                        errors.push({ [ruleKey]: ruleKey + ' Should be Minimum of ' + val2 + ' Character' })
                                    }
                                    if (_.size(dataVal) > parseInt(val2) && val1 == 'max') {
                                        console.log('dataVal=', dataVal, val2)
                                        errors.push({ [ruleKey]: ruleKey + ' Should be Maximum of ' + val2 + ' Character' })
                                    }
                                }
                            }
                            // console.log('v=',v)
                        }
                    })
                }
            }
        });
    }


    return {
        errors,
        isValid: errors.length === 0,
    };
}

export {
    validateSignupData,
}