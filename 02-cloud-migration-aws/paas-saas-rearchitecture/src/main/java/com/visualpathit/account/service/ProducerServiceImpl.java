package com.visualpathit.account.service;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.visualpathit.account.utils.RabbitMqUtil;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

@Service
public class ProducerServiceImpl implements ProducerService {

    private static final String EXCHANGE_NAME = "messages";

    @Override
    public String produceMessage(String message) {
        try {
            ConnectionFactory factory = RabbitMqUtil.getConnectionFactory();

            Connection connection = factory.newConnection();
            System.out.println("Connection open status " + connection.isOpen());

            Channel channel = connection.createChannel();
            channel.exchangeDeclare(EXCHANGE_NAME, "fanout");
            channel.basicPublish(EXCHANGE_NAME, "", null, message.getBytes());

            System.out.println(" [x] Sent '" + message + "'");

            channel.close();
            connection.close();

        } catch (IOException io) {
            System.out.println("IOException");
            io.printStackTrace();
        } catch (TimeoutException toe) {
            System.out.println("TimeoutException : " + toe.getMessage());
            toe.printStackTrace();
        } catch (Exception e) {
            System.out.println("Exception : " + e.getMessage());
            e.printStackTrace();
        }

        return "response";
    }
}
