package controllers;

import java.io.File;

import play.mvc.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.annotation.processing.FilerException;
import javax.imageio.ImageIO;
import play.Logger;
import play.Play;
import play.libs.Files;
import play.libs.IO;
import play.libs.Images;

/**
 * A sample controller for file upload
 * @author gre
 */
public class Application extends Controller {
    
    
    static boolean fileExists(File file) {
        return (Play.getFile("/public/files/"+file.getName()).exists());
    }
    static File putFile(File file)  {
        if (file != null) {
            try {
                File f = Play.getFile("/public/files/" + file.getName());
                File dir = new File(f.getParent());
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                f.createNewFile();

                Files.copy(file, f);

                return f;
            } catch (IOException e) {
                return null;
            }
        }
     return null;
 }
    
    
    public static void index() {
        render();
    }
    
    public static void postFile(File file, boolean isSynchronous) {
        if(isSynchronous)
            index(); // when sending a file synchronously, redirect to index
        String status = "";
        if (file == null) {
            status = "fileRequired";
            render(status);
        }
        if (fileExists(file)) {
            status = "fileExists";
            render(status);
        }
        File f = putFile(file);
        if (f == null) {
            status = "internalError";
            render(status);
        }
        Logger.info("postedFile : %s", f.getPath());
        status = "sent";
        String fileName = f.getName();
        render(status, fileName);
    }

}