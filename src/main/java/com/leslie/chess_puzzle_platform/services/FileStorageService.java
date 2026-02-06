package com.leslie.chess_puzzle_platform.services;

import jakarta.annotation.PostConstruct;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;


@Service
@Slf4j
public class FileStorageService {

    @Value("${app.storage.path}")
    private String GlobalPath;

    private Path rootPathLocation;

    @PostConstruct
    public void init(){
        this.rootPathLocation = Paths.get(this.GlobalPath);
        try {
            Files.createDirectories(rootPathLocation);
        } catch (IOException e) {
            throw new RuntimeException("Cannot init storage");
        }
    }


    public Path load(@NonNull String path) {
        return rootPathLocation.resolve(path);
    }

    public Resource loadAsResource(@NonNull String  path)  throws RuntimeException{
        try{
            Path resourcePath = load(path);
            UrlResource resource = new UrlResource(resourcePath.toUri());
            if(!resource.exists()){
                throw new RuntimeException("File Not Found" + path);
            }
            return resource;
        }
        catch(Exception e){
            throw new RuntimeException("File not found " + path, e);
        }
    }

    public byte[] loadAsBytes(@NonNull String path) {
        try{
            Path resourcePath = load(path);
            return Files.readAllBytes(resourcePath);
        }
        catch(Exception e){
            log.warn("File Not Found , Please Try again Later ! ");
        }
        return new byte[0];
    }


    public String store(
            @NonNull MultipartFile fileToUpload)
            throws Exception
    {
        if(fileToUpload.isEmpty()){
            throw new RuntimeException("Could Not store Empty Files");
        }
        return uploadFile(fileToUpload,rootPathLocation);
    }



    private String uploadFile (
            @NonNull MultipartFile fileToUpload,
            @NonNull Path path
    ) throws RuntimeException{
        try{
            File existingFolder = path.toFile();
            if(!existingFolder.exists()){
                final boolean created = existingFolder.mkdirs();
                if(!created)
                    throw new RuntimeException("Could not create Folder");
            }
            final String fileExtension = getExtension(Objects.requireNonNull(fileToUpload.getOriginalFilename()));
            final String fileStorageName = System.currentTimeMillis() + fileExtension;
            final Path absolutePath = path.resolve(fileStorageName);
            InputStream stream = fileToUpload.getInputStream();
            Files.copy(stream,absolutePath);
            return absolutePath.toString();
        }catch(Exception e){
            throw new RuntimeException("Error Saving the File into The Disk");
        }
    }


    private String getExtension(
            @NonNull String fileName){
        if(fileName.isEmpty()){
            return "";
        }
        if(!fileName.contains(".")){return "";}
        return fileName.substring(fileName.lastIndexOf("."));
    }



}
