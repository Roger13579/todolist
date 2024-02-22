function errorHandler(res, headers){
    res.writeHeader(400, headers);
    res.write(JSON.stringify({
        status: "false",
        data: "欄位參數錯誤，或無此id"
    }));
    res.end();
}

module.exports = errorHandler;