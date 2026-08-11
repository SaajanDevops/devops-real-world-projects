package com.visualpathit.account.controller;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.visualpathit.account.utils.RabbitMqUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RabbitMqController {

    private static final String EXCHANGE_NAME = "messages";

    @RequestMapping("/rabbit")
    @ResponseBody
    public String rabbitMqTest() {
        try {
            ConnectionFactory factory = RabbitMqUtil.getConnectionFactory();

            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();

            channel.exchangeDeclare(EXCHANGE_NAME, "fanout");
            channel.basicPublish(EXCHANGE_NAME, "", null, "Hello World!".getBytes());

            channel.close();
            connection.close();

            return "Message sent successfully to RabbitMQ";

        } catch (Exception e) {
            e.printStackTrace();
            return "RabbitMQ Error: " + e.getMessage();
        }
    }
}
