export function consoleLogReq(req){
  console.log("user:")
  console.log(req.user)
  console.log("params:")
  console.log(req.params)
  console.log("query:")
  console.log(req.query)
  console.log("body:")
  console.log(req.body)
  console.log("file:");
  console.log(req.file);
  console.log("url:");
  console.log(req.url);

}