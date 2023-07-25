import { Request, Response, NextFunction } from "express"
import { User } from "../models/User";


export const Auth = {
    private: async(req: Request, res: Response, next: NextFunction) => {
        let sucess = false; 
        //Fazer verificação de auth
        if(req.headers.authorization){
          
            let hash:string = req.headers.authorization.substring(6); //BASIC -> pega depois de BASIC espaço
            // Para ver se esta pegando a msg codificada: console.log("HASH", hash)
            let decoded: string = Buffer.from(hash, 'base64').toString(); //decodificando
            let data:string[] = decoded.split(':');
            
            if(data.length === 2){
                let hasUser = await User.findOne({
                    where: {
                        email: data[0],
                        password: data[1]
                    }
                });
                if(hasUser){
                    sucess = true
                }
            }
        
        }

        if(sucess){
            next()
        }else{
            res.status(403); // not authorized
            res.json({error: 'Não autorizado'})
        }
    }
}