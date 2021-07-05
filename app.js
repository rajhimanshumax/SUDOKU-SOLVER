if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
const expressEjsLayouts = require('express-ejs-layouts');
const e = require('express');
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(expressEjsLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req,res) => {
  res.render('index');
})

app.post('/submit', async (req,res) => {
    var board = new Array(9);
    var board1= new Array(9);
    var done = new Array(9);

    //function to take input

    for(var i=0;i<9;i++){
      board[i]=[];
      done[i]=[];
      board1[i]=[];
        for(var j=0;j<9;j++){
          var element = req.body['mat' + i + j];
          if(element){
              board[i][j]=parseInt(element);
              board1[i][j]=board[i][j];
              done[i][j]=1;
          }
          else{
              board[i][j]=0;
              board1[i][j]=0;
              done[i][j]=0;
          }
        }
    }

    //function to check if current input is valid or not

    function check(i,j,k,board){
      var row = i - i%3;
      var column = j - j%3;
      for(var x=0; x<9; x++) if(board[x][j] == k) return false;
      for(var y=0; y<9; y++) if(board[i][y] == k) return false;
      for(var x=0; x<3; x++)
        for(var y=0; y<3; y++)
          if(board[row+x][column+y] == k) return false;
      return true;
    }

    // function to check if a particular row is valid or not

    function checkrow(i){
      var set1=new Set();
      for(var j=0;j<9;j++){
        if(board[i][j]!=0){
          if(set1.has(board[i][j])){
            return false;
          }
          else{
            set1.add(board[i][j]);
          }
        }
      }
      return true;
    }

    // function to check if a particular colunm is valid or not

    function checkcoln(i){
      var set1=new Set();
      for(var j=0;j<9;j++){
        if(board[j][i]!=0){
          if(set1.has(board[j][i])){
            return false;
          }
          else{
            set1.add(board[j][i]);
          }
        }
      }
      return true;
    }

    // function to check if a particular box if valid or not

    function checkbox(i){
      var var1=i/3;
      var var2=i%3;

      var1=var1*3;
      var2=var2*3;

      var set1=new Set();

      for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
          if(board[var1+i][var2+j]!=0){
            if(set1.has(board[var1+i][var2+j])){
              return false;
            }
            else{
              set1.add(board[var1+i][var2+j]);
            }
          }
        }
      }
      return true;
    }

    // function to check if the matrix given by user is valid or not

    function checkmatrix(){
      for(var i=0;i<9;i++)
        return checkrow(i)&&checkcoln(i)&&checkbox(i);
    }

    // function to find if sudoku is solvable or not if solvable then find a solution

    function issolvable(i,j){ 
      if(i==9)
          return true;
      if(j==9)
          return issolvable(i+1,0);
      if(board[i][j]!=0)
          return issolvable(i,j+1);
      for(var k=1;k<10;k++){
          if(check(i,j,k,board)){
              board[i][j]=k;
              if(issolvable(i,j+1)) 
                  return true;
              board[i][j]=0;
          }
      }
      return false;
    }

    // function to find another solution

    function issolvable1(i,j){ 
      if(i==9)
          return true;
      if(j==9)
          return issolvable1(i+1,0);
      if(board1[i][j]!=0)
          return issolvable1(i,j+1);
      for(var k=9;k>=1;k--){
          if(check(i,j,k,board1)){
              board1[i][j]=k;
              if(issolvable1(i,j+1)) 
                  return true;
              board1[i][j]=0;
          }
      }
      return false;
    }

    if(checkmatrix()==false){
      res.render('Invalidinput');
    }
    else{
      if(issolvable(0,0)==true){
        var temp=issolvable1(0,0);
        if(board==board1){
          res.render('solution', {mat : board , done : done});
        }
        else{
          return res.render('moreThanOne',{mat : board, done : done, mat2 : board1});
        }
      }
      else{
        console.log('here1');
        res.render('noSolution');
      }
    }
})

app.listen(port, () => {
  console.log(`listening to the port ${port}`);
})  
