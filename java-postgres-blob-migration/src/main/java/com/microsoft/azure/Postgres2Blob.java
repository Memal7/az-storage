package com.microsoft.azure;

import java.sql.*;
import java.util.*;
import java.util.logging.Logger;

import com.azure.core.util.BinaryData;
import com.azure.storage.blob.*;
import java.io.*;

public class Postgres2Blob {

  private static final Logger log;

  static {
    System.setProperty("java.util.logging.SimpleFormatter.format", "[%4$-7s] %5$s %n");
    log = Logger.getLogger(Postgres2Blob.class.getName());
  }

  public static void main(String[] args) throws Exception {
    log.info("Loading application properties");
    Properties properties = new Properties();
    properties.load(Postgres2Blob.class.getClassLoader().getResourceAsStream("application.properties"));
    // Upload as stream or binary
    uploadStream(properties);
  }

  public static void uploadBinary(Properties properties) throws SQLException {
    // Create a BlobServiceClient object which will be used to create a container
    // client
    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .connectionString(properties.getProperty("connectStr")).buildClient();
    // Create the container and return a container client object
    BlobContainerClient containerClientImages = blobServiceClient.getBlobContainerClient("images");
    BlobContainerClient containerClientVideos = blobServiceClient.getBlobContainerClient("videos");

    String sql = "SELECT id, image, video FROM blob;";
    try (Connection con = DriverManager.getConnection(properties.getProperty("url"), properties);
        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery()) {

      while (rs.next()) {
        long id = rs.getLong("id");
        byte[] imgBytes = rs.getBytes("image");
        byte[] videoBytes = rs.getBytes("video");
        // Get a reference to a blob
        String filenameImg = "image-" + id + ".jpeg";
        BlobClient blobClientImage = containerClientImages.getBlobClient(filenameImg);
        String filenameVid = "video-" + id + ".mp4";
        BlobClient blobClientVideo = containerClientVideos.getBlobClient(filenameVid);
        // Upload to blob storage
        log.info("Migrating image to blob ...");
        blobClientImage.upload(BinaryData.fromBytes(imgBytes));
        log.info("Migrating video to blob ...");
        blobClientVideo.upload(BinaryData.fromBytes(videoBytes));
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public static void uploadStream(Properties properties) throws SQLException {
    // Create a BlobServiceClient object which will be used to create a container
    // client
    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .connectionString(properties.getProperty("connectStr")).buildClient();
    // Create the container and return a container client object
    BlobContainerClient containerClientImages = blobServiceClient.getBlobContainerClient("images");
    BlobContainerClient containerClientVideos = blobServiceClient.getBlobContainerClient("videos");

    String sql = "SELECT id, image, video, OCTET_LENGTH(image) AS img_size, OCTET_LENGTH(video) AS vid_size FROM blob;";
    try (Connection con = DriverManager.getConnection(properties.getProperty("url"), properties);
        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery()) {

      int i = 1;
      while (rs.next()) {
        // Get a reference to a blob
        String filenameImg = "image-" + i + ".jpeg";
        BlobClient blobClientImage = containerClientImages.getBlobClient(filenameImg);
        String filenameVid = "video-" + i + ".mp4";
        BlobClient blobClientVideo = containerClientVideos.getBlobClient(filenameVid);
        // Get image and video size
        long imgSize = rs.getLong("img_size");
        long vidSize = rs.getLong("vid_size");
        // Upload to blob storage
        try (InputStream inputStreamImage = rs.getBinaryStream("image")) {
          log.info("Migrating image to blob ...");
          blobClientImage.upload(inputStreamImage, imgSize, true);
        } catch (IOException e) {
          e.printStackTrace();
        }
        try (InputStream inputStreamVideo = rs.getBinaryStream("video")) {
          log.info("Migrating video to blob ...");
          blobClientVideo.upload(inputStreamVideo, vidSize, true);
        } catch (IOException e) {
          e.printStackTrace();
        }
        i++;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }
}
