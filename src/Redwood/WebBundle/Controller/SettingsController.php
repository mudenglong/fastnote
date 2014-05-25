<?php 

namespace Redwood\WebBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Redwood\Common\FileToolkit;

use Imagine\Gd\Imagine;

class SettingsController extends BaseController
{

    public function profileAction() 
    {
    	$user = $this->getCurrentUser();
        return $this->render('RedwoodWebBundle:Settings:base.html.twig', array(
            'user' => $user,
        ));
    }

    public function avatarAction(Request $request)
    {
        $user = $this->getCurrentUser();
        $form = $this->createFormBuilder()
            ->add('avatar', 'file')
            ->getForm();
        if ($request->getMethod() == 'POST') {
            $form->bind($request);
            if ($form->isValid()) {
                $data = $form->getData();
                $file = $data['avatar'];
                
                // if (!FileToolkit::isImageFile($file)) {
                //     return $this->createMessageResponse('error', '上传图片格式错误，请上传jpg, gif, png格式的文件。');
                // }

                $filenamePrefix = "user_{$user['id']}";
                $hash = substr(md5($filenamePrefix.time()),-8);
                $ext = $file->getClientOriginalExtension();

                $filename = $filenamePrefix.$hash.'.'.$ext;
                $directory = $this->container->getParameter('redwood.upload.public_directory').'/tmp';
                $file = $file->move($directory, $filename);

                $fileName = str_replace('.', '!', $file->getFilename());
  
                return $this->redirect($this->generateUrl('settings_avatar_crop', array(
                    'file' => $fileName,
                    )
                ));

                

            }

        }
        
        return $this->render('RedwoodWebBundle:Settings:avatar.html.twig',array(
            'user' => $user,
            'form' => $form->createView(),
        ));
    }

    public function avatarCropAction(Request $request)
    {
        $currentUser = $this->getCurrentUser();
        $filename = $request->query->get('file');
        $filename = str_replace('!', '.', $filename);
        // $filename = str_replace(array('..' , '/', '\\'), '', $filename);

        $pictureFilePath = $this->container->getParameter('redwood.upload.public_directory') . '/tmp/' . $filename;

        $imagine = new Imagine();
        $image = $imagine->open($pictureFilePath);
        $naturalSize = $image->getSize();

        
        
        var_dump($naturalSize);
        return $this->render('RedwoodWebBundle:Settings:avatar-crop.html.twig', array(
            'pictureUrl' => '12',
        ));
    }
}