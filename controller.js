const mysql = require("mysql");
const { hashPassword } = require('./utils');

class Controller {
async getTodos() {
        return new Promise((resolve, _) => resolve(data));
        
    }
async getTodo(id) {
        return new Promise((resolve, reject) => {
            let todo = data.find((todo) => todo.id === parseInt(id));
            if (todo) {
                resolve(todo);
            } else {
                reject(`Todo with id ${id} not found `);
            }
        });
    }

async createTodo(todo) {
        return new Promise((resolve, _) => {
        const todo_id = data.length+1
        let newTodo = {
        id: todo_id,
        ...todo,
        };
        data.push(newTodo)
        resolve(newTodo);
        });
        }
async CreateUser(FirstName, LastName, login, password ){
            console.log(password);
            return new Promise ((resolve, reject) => {
            const errors = {
            FirstName:'',
            LastName:'',
            login: '',
            password: '',
            };
            
            let hasErrors = false;
            
            if (FirstName === '') {
            errors.FirstName = 'Пустое поле имя';
            hasErrors = true;
            }
            if (LastName === '') {
            errors.LastName = 'Пустое поле фамилия';
            hasErrors = true;
            }
            
            if (login === '') {
            errors.login = 'Пустое поле пароль';
            hasErrors = true;
            }
            
            if (password === '') {
            errors.password = 'Пустое поле пароль';
            hasErrors = true;
            }
            
            
            if (hasErrors) {
            reject(errors);
            } else {
            
            const connection = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: "auction"
            });
            connection.connect((err) => {
            if (err) {
            reject(err);
            } else {
            console.log('Database - OK ');
            connection.query('SELECT COUNT (*) AS a FROM user WHERE login = ?',
            [login],
            (err, results, fields) => {
            if (err) {
            reject(err);
            } else if (results[0].a === 0) {
            connection.query(
            'INSERT INTO user SET ?',
            {
            FirstName:FirstName,
            LastName:LastName,
            login: login,
            password: hashPassword(password),
            },
            (err, results, fields) => {
                console.log(err);
            if (err) {
            reject(err);
            } else {
                console.log(results);
            resolve(results);
            }
            connection.end((err) => {
            if (err) {
            console.log(err);
            } else {
            console.log('Database - Close');
            }
            });
            });
            } else {
            errors.login = 'Данный логин занят';
            reject(errors);
            }
            },
            );
            }
            })
            }
            });
            }

            async LoginUser(login, password){
              console.log('test');
                return new Promise ((resolve, reject) => {
                    const connection = mysql.createConnection({
                        host: "127.0.0.1",
                        user: "root",
                        database: "auction",
                        password: "root"
                    });
                    connection.connect((err) => {
                        if (err) {
                          reject(err);
                        } else {
                          console.log('Database - OK ');
                          connection.query(
                            'SELECT id_user FROM auction.user WHERE login = ? and password = ?',
                            [
                              login,
                              hashPassword(password)
                            ],
                            (err, results, fields) => {
                              if (err) {
                                reject(err);
                              } else if (results.length === 0) {
                                reject('User not found');
                              } else {
                                const generate_token = (length) => {
                                  const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
                                  const b = [];
                                  for (let i = 0; i < length; i += 1) {
                                    let j = (Math.floor(Math.random() * (a.length - 1)));
                                    b.push(a[j]);
                                  }
                                  return b.join('');
                                };
                                const token = generate_token(32);
                                const id_user = results[0].id_user;
                                console.log(id_user);
                                connection.query(
                                     'UPDATE auction.user SET token = ? WHERE id_user = ?',
                                     [
                                       token,
                                       id_user
                                     ],
                                     (err, results, fields) =>{
                                       if (err){
                                         reject(err);
                                       }else{
                                         resolve(token);
                                       }
                                       connection.end((err) => {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                          console.log('Database - Close');
                                        }
                                      });    
                                     }
                                   )
                                  }
                                });
                              }    
                           });
                        })
                      }

async Createlot(id_lot, id_user, description, title, date){
                return new Promise ((resolve, reject) => {
                const connection = mysql.createConnection({
                host: "127.0.0.1",
                user: "root",
                database: "auction",
                password: "root"
                });
                connection.connect((err) => {
                if (err) {
                reject(err);
                } else {
                console.log('Database - OK ');
                connection.query(
                'INSERT INTO auction.lot SET ?',
                {
                    id_lot: id_lot,
                    id_user: id_user,
                    description: description,
                    title: title,
                    date: date
                },
                (err, results, fields) => {
                if (err) {
                reject(err);
                } else {
                resolve(results.insertId);
                }
                connection.end((err) => {
                if (err) {
                console.log(err);
                } else {
                console.log('Database - Close');
                }
                });
                });
                }
                })
                });
                }

                async deletelot(id_lot) {
                  const promise = this.getIdUsersByToken(token);
                  const id_user = await promise;
                  return new Promise ((resolve, reject) => {
                  const connection = mysql.createConnection({
                  host: "127.0.0.1",
                  user: "root",
                  database: "auction",
                  password: "root"
                  });
                  
                  connection.connect((err) => {
                  if (err) {
                  reject(err)
                  } else {
                  console.log('Database - OK');
                  connection.query(' DELETE FROM lot WHERE id_lot = ? AND id_user = ?', [id_lot, id_user], (err, results, fields) => {
                  if (err) {
                  reject(err);
                  } else {
                  resolve(results);
                  }
                  connection.end((err) => {
                  if (err) {
                  console.log(err);
                  } else {
                  console.log('Database - Close');
                  }
                  })
                  })
                  }
                  })
                  });
                  }



async getIdUserByToken(token) {
    return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "auction"
    });
    console.log(token);
    connection.query(
    'SELECT id_user from user WHERE token = ?',
    [
    token
    ],
    (err,results, fields) => {
    if (err) {
    reject(err);
    } else {
    resolve(results[0].id_user);
    }
    }
    );
    });
    }

async logout(token) {
    const promise = this.getIdUsersByToken(token);
    const id_user = await promise;
    return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "auction"
    });
    connection.connect((err) => {
    if (err) {
    reject(err);
    } else {
    console.log('Database connected');
    connection.query(
    'UPDATE user SET token_ = NULL WHERE id_user = ?',
    [
    id_user
    ],
    (err, results) => {
    if (err) {
    reject(err);
    } else {
    resolve(results); 
    }
    connection.end((err) => {
    if (err) {
    console.log(err);
    } else {
    console.log('Database closed');
    }
    });
    });
    }
    })
    });
    }
    
    async Createstavka(id_stavka, id_lot, id_user, price, date){
      return new Promise ((resolve, reject) => {
      const connection = mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      database: "auction",
      password: "root"
      });
      connection.connect((err) => {
      if (err) {
      reject(err);
      } else {
      console.log('Database - OK ');
      connection.query(
      'INSERT INTO auction.stavka SET ?',
      {
        id_stavka: id_stavka,
        id_lot: id_lot,
        id_user: id_user,
        price: price,
        date: date
      },
      (err, results, fields) => {
      if (err) {
      reject(err);
      } else {
      resolve(results.insertId);
      }
      connection.end((err) => {
      if (err) {
      console.log(err);
      } else {
      console.log('Database - Close');
      }
      });
      });
      }
      })
      });
      }

async deletelot(id_lot) {
    const promise = this.getIdUsersByToken(token);
    const id_user = await promise;
    return new Promise ((resolve, reject) => {
    const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "auction",
    password: "root"
    });
    
    connection.connect((err) => {
    if (err) {
    reject(err)
    } else {
    console.log('Database - OK');
    connection.query(' DELETE FROM lot WHERE id_lot = ? AND id_user = ?', [id_lot, id_user], (err, results, fields) => {
    if (err) {
    reject(err);
    } else {
    resolve(results);
    }
    connection.end((err) => {
    if (err) {
    console.log(err);
    } else {
    console.log('Database - Close');
    }
    })
    })
    }
    })
    });
    }
    }
 
module.exports = Controller;