const dbCon =require('../../Dbconnection/connection.js');

/// get Datatable with Argument
const getDataRows = (funcname, args)=>
{
    return new Promise((resolve, reject) => {
        // call db function passing argument
        dbCon.func(funcname,args)
            .then(data => {
                resolve(data);
            })
            //error
            .catch(error => {
                // send error if any
                reject(error);
            });
        });
}

/// get Datatable without Argument
const getDataRowsNoArg = async (funcname)=>
{
    // call db function without argument
    return new Promise((resolve, reject) => {
        dbCon.func(funcname)
            .then(data => {
                // send the results back
                resolve(data);
            })
            //error
            .catch(error => {
                // send error if any
                reject(error);

        });
    })
}
/// get Datatable with Argument
const getDataReturnValue = (funcname, args)=>
{
    return new Promise((resolve, reject) => {
        // call db function passing argument
        dbCon.func(funcname,args)
            .then(data => {
                // data format=[{property:prop_value}]   - return the prop_value from the list object
                resolve((data[0])[Object.keys(data[0])[0]]);
            })
            //error
            .catch(error => {
                // send error if any
                reject(error);
            });
        });
}


module.exports = {
    getDataRows,        // get datatable with argument
    getDataRowsNoArg,    // get datatable without argument
    getDataReturnValue,
}