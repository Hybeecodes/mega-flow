const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt-nodejs');
const Comment = require('../models/Comment');

module.exports.getAllPosts = ()=>{
    return new Promise((resolve,reject)=>{
        Post.find({},{}).populate('author','username').exec((err,posts)=>{
            if(err)
                reject(err);
            else
                resolve(posts);
        })
    })
}

module.exports.getAllUsers = ()=>{
    return new Promise((resolve,reject)=>{
        User.find({},{},(err,users)=>{
            if(err){
                reject(err);
            }else{
                resolve(users);
            }
        })
    })
    
}

module.exports.getUserById = (userId)=>{
        return new Promise((resolve,reject)=>{
            User.findById(userId,(err,user)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(user);
                }
        })
    })    
}

module.exports.getUserByLogin = (username,password)=>{
    return new Promise((resolve,reject)=>{
        User.findOne({username:username},(err,user)=>{
            if(err){
                reject(err);
            }else{
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(isMatch){
                        resolve(user);
                    }else{
                        reject(err);
                    }
                })
                
            }
    })
})    
}

module.exports.updateUserProfile = (req,res)=>{
    return new Promise((resolve,reject)=>{
        var blogname = req.body.blogname;
        var username = req.body.username;
        var email= req.body.email;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var address = req.body.address;
        var city = req.body.city;
        var country = req.body.country;
        var zipcode = req.body.zipcode;
        var facebook = req.body.facebook;
        var twitter = req.body.twitter;
        var instagram = req.body.instagram;
        var about = req.body.about;
        if(req.file){
          var photo = req.file.path.substring(6);
          
        }else{
          var photo = req.session.user.photo;
        }
    
        //check if user info exist
            User.findOneAndUpdate({_id: req.session.user._id},
               {$set:{
                 blogname:blogname,
                 username:username,
                 email:email,
                 firstname:firstname,
                 lastname:lastname,
                 address:address,
                 city:city,
                 country:country,
                 zipcode:zipcode,
                 facebook:facebook,
                 twitter:twitter,
                 instagram:instagram,
                 about:about,
                 photo:photo
                }},(err,result)=>{
                  if(err){
                    reject(err);
                  }else{
                    // console.log(req.user.username+"'s profile was updated successfully");
                    resolve(result);
                  }
            });
          
        })      
}

module.exports.checkUserInfoByEmail = (email)=>{
    UserInfo.findOne({email:email},(err,userInfo)=>{
        if(err){
            return false;
        }else{
            if(userInfo){
                return true;
            }else{
                return false;
            }
        }
    })
}

module.exports.addNewUser = (userData)=>{
    return new Promise((resolve,reject)=>{
        var firstname = userData.firstname;
        var lastname = userData.lastname;
        var password = bcrypt.hashSync(userData.password);
        var email = userData.email;
        var username = userData.username;
        var photo = userData.photo;
        newUser = {
            firstname: firstname,
            lastname: lastname,
            password: password,
            email: email,
            username: username,
            photo: photo
        };

        User.create(newUser,(err,user)=>{
            if(err){
                reject(err);
            }else{
                resolve(user);
            }
        })
    })
    
}

module.exports.validateData = (...args)=>{
    const dataArr = args;
    var check = true;
    for (let i = 0; i < dataArr.length; i++) {
       var data = dataArr[i];
    //    console.log(data)
        if(data === '' || data === undefined){
            check = false;
            break;
        }
    }
    return check;
}

module.exports.checkUserByUsername= (username)=>{
    console.log(username)
    User.findOne({username:username},(err,user)=>{
        if(err){
            return false;
        }else if(user){
            return true;           
        }else{
            return false;
        }
    })
}

module.exports.checkUserByEmail= (email)=>{
    User.findOne({email:email},(err,user)=>{
        if(err){
            return false;
        }else{
            if(user)
                return true;
            else
                return false;
        }
    })
}

module.exports.changeUserPass = (userId,email,password)=>{
    return new Promise((resolve,reject)=>{
        User.findOneAndUpdate({_id:userId,email:email},{$set:{password:password}},(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    })
    
}

module.exports.getUserInfoByInfo = (userId)=>{
    return new Promise((resolve,reject)=>{
        User.findById(userId,(err,userInfo)=>{
            if(err){
                reject(err);
            }else{
                resolve(userInfo);
            }
        });
    })
   
}

module.exports.getUserPosts = (author)=>{
    return new Promise((resolve,reject)=>{
        Post.find({author:author}).populate('author','username').exec((err,posts)=>{
            if(err)
                reject(err);
            else
                resolve(posts);
        })
    });
}

module.exports.addNewPost = (postData)=>{
    return new Promise((resolve,reject)=>{
        Post.create(postData,(err,post)=>{
            if(err)
                reject(err);
            else
                resolve(post);
        });
    });
}

module.exports.getPostById = (postId)=>{
    return new Promise((resolve,reject)=>{
        Post.findById(postId).populate('comments').populate('author','username').exec((err,post)=>{
            console.log(post);
            if(err)
                reject(err);
            else
                resolve(post);
        })
    });
}

module.exports.addComment = (commentData)=>{
    return new Promise((resolve,reject)=>{
        Comment.create(commentData,(err,comment)=>{
            if(err)
                reject(err);
            else
                resolve(comment);
        });
    })
}

module.exports.getPostComment = (postId)=>{
    return new Promise((resolve,reject)=>{
        Comment.find({post:postId}).exec((err,comments)=>{
            if(err)
                reject(err);
            else
                resolve(comments);
        });
    });
}

module.exports.updatePostViews = (postId)=>{
        Post.findById(postId,(err,post)=>{
            if(err)
                reject(err);
            else{
                Post.updateOne({_id:post._id},{$set:{views:post.views+1}},(err,post)=>{
                    if(err)
                        return false;
                    else
                        return true;
                });
            }
        });
}

module.exports.getPopularPosts = ()=>{
    return new Promise((resolve,reject)=>{
        Post.find({},{}).sort({'views':'desc'}).limit(5).exec((err,posts)=>{
            if(err)
                reject(err);
            else
                resolve(posts);
        })
    })
}

module.exports.getRecentPosts = ()=>{
    return new Promise((resolve,reject)=>{
        Post.find({},{}).sort({'created_at':'asc'}).limit(5).exec((err,posts)=>{
            if(err)
                reject(err);
            else
                resolve(posts);
        })
    })
}

module.exports.paginatePost = ()=>{
    return new Promise((resolve,reject)=>{
        Post.paginate({},{offset:2,page:1,limit:5},(err,posts)=>{
            console.log(posts);
        })
    });
}