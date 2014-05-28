<?php
namespace Redwood\Service\Content\Impl;

use Redwood\Service\Common\BaseService;
use Redwood\Service\Content\FileService;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

use Imagine\Imagick\Imagine;
use Imagine\Image\Box;
use Imagine\Image\Point;
use Imagine\Image\ImageInterface;
use Redwood\Common\FileToolkit;

class FileServiceImpl extends BaseService implements FileService
{

    private function newTempAvatar($image, $imageTarget)
    {
        $image->resize(new Box($imageTarget['width'], $imageTarget['height']));
        $image->save($imageTarget['filePath'], array('quality' => 90));

        return new File($imageTarget['filePath']);
    }

    public function uploadAvatar($filePath, $options)
    {
        
        $imagine = new Imagine();
        $basicImage = $imagine->open($filePath)->copy();
        $basicImage->crop(new Point($options['x'], $options['y']), new Box($options['width'], $options['height']));

        $pathinfo = pathinfo($filePath);

        $largeImageTarget = array(
                'width' => 200,
                'height' => 200,
                'filePath' => "{$pathinfo['dirname']}/{$pathinfo['filename']}_large.{$pathinfo['extension']}",
        );

        $mediumImageTarget = array(
                'width' => 120,
                'height' => 120,
                'filePath' => "{$pathinfo['dirname']}/{$pathinfo['filename']}_medium.{$pathinfo['extension']}",
        );

        $smallImageTarget = array(
                'width' => 48,
                'height' => 48,
                'filePath' => "{$pathinfo['dirname']}/{$pathinfo['filename']}_small.{$pathinfo['extension']}",
        );

        $tempLargeImage = $this->newTempAvatar($basicImage, $largeImageTarget);
        $largeImageInfo = $this->generateUri($tempLargeImage);
        $largeAvatar = $this->saveAvatarFile($largeImageInfo, $tempLargeImage);

        $tempMediumImage = $this->newTempAvatar($basicImage, $mediumImageTarget);
        $mediumImageInfo = $this->generateUri($tempMediumImage);
        $mediumAvatar = $this->saveAvatarFile($mediumImageInfo, $tempMediumImage);

        $tempSmallImage = $this->newTempAvatar($basicImage, $smallImageTarget);
        $smallImageInfo = $this->generateUri($tempSmallImage);
        $smallAvatar = $this->saveAvatarFile($smallImageInfo, $tempSmallImage);

        return array(
            'largeAvatar' => $largeAvatar, 
            'mediumAvatar' => $mediumAvatar, 
            'smallAvatar' => $smallAvatar,
            'largeImageInfo' => $largeImageInfo,
            'mediumImageInfo' => $mediumImageInfo,
            'smallImageInfo' => $smallImageInfo,
        );

    }

    public function sqlUriConvertAbsolutUri($sqlUri)
    {
        return $this->getKernel()->getParameter('redwood.upload.public_directory') . '/' . str_replace('public://', '', $sqlUri);
    }

    private function saveAvatarFile($newImageInfo, $tempImage)
    {
        $finalPath = $this->sqlUriConvertAbsolutUri($newImageInfo['directory']);
        // if (!is_writable($finalPath)) {
        //     throw $this->createServiceException("文件上传路径{$finalPath}不可写，文件上传失败。");
        // }
        return $tempImage->move($finalPath, $newImageInfo["filename"]);
    }
	

    private function generateUri(File $file)
    {

        if ($file instanceof UploadedFile) {
            $filename = $file->getClientOriginalName();
        } else {
            $filename = $file->getFilename();
        }

        $filenameParts = explode('.', $filename);
        $ext = array_pop($filenameParts);
        if (empty($ext)) {
            throw $this->createServiceException('获取文件扩展名失败！');
        }

        $newImage["directory"] = 'public://user/'.date('Y') . '/' . date('m-d') . '/';
       
        $newImage["filename"] = date('His') . substr(uniqid(), - 6) . substr(uniqid('', true), - 6) . '.' . $ext;
        
        return $newImage;
    }


}