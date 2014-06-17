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

    public function uploadHtmlPic($filePath, array $options)
    {
        $pageRecord = $this->cropPage($filePath, $options);
        var_dump("END uploadHtmlPic");
    }

    private function getDivHeihtByLines($lines, $totalHeight)
    {
        foreach ($lines as $key => $value) {
            $nextKey = $key+1;
            
            if(isset($lines[$nextKey]))
            {
                 $lines[$key]['height']  = $lines[$nextKey]['naturalTop'] - $lines[$key]['naturalTop'] ;
            }else{
                $lines[$key]['height'] = $totalHeight - $lines[$key]['naturalTop'];
            }

        }

        return $lines;

    }

    private function cropPage($filePath, $options)
    {
        $postData = $options['postData'];
        $lines    = $postData['lines'];
        if (array_key_exists("boxs",$postData)) 
        { 
            $boxs = $postData['boxs'] ;
        }

        $imagine = new Imagine();
        $pathinfo = pathinfo($filePath);
        $naturalSize = $imagine->open($filePath)->getSize();
        $basicImage = $imagine->open($filePath)->copy();


        $lines = $this->getDivHeihtByLines($lines, $naturalSize->getHeight());

        // $basicImage->crop(new Point(0, (int)$lines[0]['naturalTop']), new Box($naturalSize->getWidth(), $lines[0]['height']));
        // $tmp = "{$pathinfo['dirname']}/{$pathinfo['filename']}_small.{$pathinfo['extension']}";
        // $basicImage->save($tmp, array('quality' => 70));

        // $basicImage2 = $imagine->open($filePath)->copy();

        // $basicImage2->crop(new Point(0, (int)$lines[1]['naturalTop']), new Box($naturalSize->getWidth(), $lines[1]['height']));
        // $tmp2 = "{$pathinfo['dirname']}/{$pathinfo['filename']}_small222.{$pathinfo['extension']}";
        // $basicImage2->save($tmp2, array('quality' => 70));


        var_dump($naturalSize);
        // var_dump($tmp);



        // $largeImageTarget = array(
        //         'width' => 200,
        //         'height' => 200,
        //         'filePath' => "{$pathinfo['dirname']}/{$pathinfo['filename']}_large.{$pathinfo['extension']}",
        // );

        // $image->resize(new Box($imageTarget['width'], $imageTarget['height']));
        // $image->save($imageTarget['filePath'], array('quality' => 90));

        // return new File($imageTarget['filePath']);

        // $tempLargeImage = $this->newTempAvatar($basicImage, $largeImageTarget);
        // $largeImageInfo = $this->generateUri($tempLargeImage);
        // $largeAvatar = $this->saveAvatarFile($largeImageInfo, $tempLargeImage);


    }


    private function change1111111Avatar($userId, $filePath, array $options)
    {
        $user = $this->getUser($userId);
        if (empty($user)) {
            throw $this->createServiceException('用户不存在，头像更新失败！');
        }

        $avatarRecord    = $this->getFileService()->uploadAvatar($filePath, $options);
        $smallAvatarUri  = $avatarRecord['smallImageInfo']['directory'].$avatarRecord['smallImageInfo']['filename'];
        $mediumAvatarUri = $avatarRecord['mediumImageInfo']['directory'].$avatarRecord['mediumImageInfo']['filename'];
        $largeAvatarUri  = $avatarRecord['largeImageInfo']['directory'].$avatarRecord['largeImageInfo']['filename'];
        
        @unlink($filePath);

        $oldAvatars = array(
            'smallAvatar' => $user['smallAvatar'] ? $this->getFileService()->sqlUriConvertAbsolutUri($user['smallAvatar']) : null,
            'mediumAvatar' => $user['mediumAvatar'] ? $this->getFileService()->sqlUriConvertAbsolutUri($user['mediumAvatar']) : null,
            'largeAvatar' => $user['largeAvatar'] ? $this->getFileService()->sqlUriConvertAbsolutUri($user['largeAvatar']) : null,
        );

        array_map(function($oldAvatar){
            if (!empty($oldAvatar)) {
                @unlink($oldAvatar);
            }
        }, $oldAvatars);

        return  $this->getUserDao()->updateUser($userId, array(
            'smallAvatar'  => $smallAvatarUri,
            'mediumAvatar' => $mediumAvatarUri,
            'largeAvatar'  => $largeAvatarUri,
        ));

    }


}